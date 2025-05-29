-- Add staff table (missing from initial schema)
CREATE TABLE staff (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    position TEXT NOT NULL,
    hire_date DATE DEFAULT CURRENT_DATE
);

-- Add admin actions audit table for tracking admin operations
CREATE TABLE admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'create_user', 'update_role', 'assign_doctor', etc.
    target_user_id UUID REFERENCES profiles(id),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add function to create user with role
CREATE OR REPLACE FUNCTION create_user_with_role(
    user_email TEXT,
    user_password TEXT,
    user_role user_role,
    user_full_name TEXT,
    additional_data JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- This would typically be handled by your application layer
    -- But we can create the profile structure for when users are created
    new_user_id := uuid_generate_v4();
    
    -- Insert into profiles (this assumes the auth.users record exists)
    INSERT INTO profiles (id, role, full_name, email)
    VALUES (new_user_id, user_role, user_full_name, user_email);
    
    -- Insert into role-specific table based on role
    IF user_role = 'doctor' THEN
        INSERT INTO doctors (id, specialization, license_number)
        VALUES (
            new_user_id, 
            COALESCE(additional_data->>'specialization', 'General Medicine'),
            COALESCE(additional_data->>'license_number', 'TEMP-' || new_user_id)
        );
    ELSIF user_role = 'patient' THEN
        INSERT INTO patients (id, date_of_birth, gender)
        VALUES (
            new_user_id,
            COALESCE((additional_data->>'date_of_birth')::date, CURRENT_DATE),
            COALESCE((additional_data->>'gender')::gender, 'other')
        );
    ELSIF user_role = 'staff' THEN
        INSERT INTO staff (id, department, position)
        VALUES (
            new_user_id,
            COALESCE(additional_data->>'department', 'General'),
            COALESCE(additional_data->>'position', 'Staff')
        );
    END IF;
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add missing INSERT and UPDATE policies

-- Profiles policies (add insert for admins)
CREATE POLICY "Admins can insert new profiles" ON profiles
    FOR INSERT WITH CHECK (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- Doctors policies
CREATE POLICY "Admins can insert doctors" ON doctors
    FOR INSERT WITH CHECK (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admins can update doctor profiles" ON doctors
    FOR UPDATE USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- Patients policies
CREATE POLICY "Admins and staff can insert patients" ON patients
    FOR INSERT WITH CHECK (
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff')
    );

CREATE POLICY "Authorized roles can update patient data" ON patients
    FOR UPDATE USING (
        auth.uid() = id OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'doctor')
    );

-- Staff policies
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff are viewable by authorized roles" ON staff
    FOR SELECT USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff') OR
        auth.uid() = id
    );

CREATE POLICY "Admins can insert staff" ON staff
    FOR INSERT WITH CHECK (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admins can update staff" ON staff
    FOR UPDATE USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- Appointments policies (add insert/update)
CREATE POLICY "Authorized users can create appointments" ON appointments
    FOR INSERT WITH CHECK (
        auth.uid() = patient_id OR
        auth.uid() = doctor_id OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff')
    );

CREATE POLICY "Authorized users can update appointments" ON appointments
    FOR UPDATE USING (
        auth.uid() = patient_id OR
        auth.uid() = doctor_id OR
        (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'staff')
    );

-- Medical records policies (add insert/update)
CREATE POLICY "Doctors and admins can create medical records" ON medical_records
    FOR INSERT WITH CHECK (
        auth.uid() = doctor_id OR
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Doctors and admins can update medical records" ON medical_records
    FOR UPDATE USING (
        auth.uid() = doctor_id OR
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- Admin actions policies
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admin actions" ON admin_actions
    FOR SELECT USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admins can insert admin actions" ON admin_actions
    FOR INSERT WITH CHECK (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' AND
        auth.uid() = admin_id
    );

-- Add performance indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor_id ON medical_records(doctor_id);
CREATE INDEX idx_medical_records_date ON medical_records(record_date);
CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_target_user_id ON admin_actions(target_user_id);
CREATE INDEX idx_admin_actions_action_type ON admin_actions(action_type);

-- Add trigger for staff updated_at
CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Add views for easier admin queries (views don't support RLS policies)
CREATE VIEW user_summary AS
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.role,
    p.created_at,
    CASE 
        WHEN p.role = 'doctor' THEN d.specialization
        WHEN p.role = 'staff' THEN s.department
        ELSE NULL
    END as department_or_specialization,
    CASE 
        WHEN p.role = 'doctor' THEN d.license_number
        WHEN p.role = 'patient' THEN pt.contact_number
        WHEN p.role = 'staff' THEN s.position
        ELSE NULL
    END as additional_info
FROM profiles p
LEFT JOIN doctors d ON p.id = d.id
LEFT JOIN patients pt ON p.id = pt.id
LEFT JOIN staff s ON p.id = s.id;

-- Add function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
    action_type TEXT,
    target_user_id UUID DEFAULT NULL,
    details JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
    action_id UUID;
BEGIN
    INSERT INTO admin_actions (admin_id, action_type, target_user_id, details)
    VALUES (auth.uid(), action_type, target_user_id, details)
    RETURNING id INTO action_id;
    
    RETURN action_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
