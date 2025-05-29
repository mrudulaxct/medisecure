-- Add isOnboarded column to profiles table
ALTER TABLE profiles ADD COLUMN is_onboarded BOOLEAN DEFAULT FALSE;

-- Add function to complete user onboarding
CREATE OR REPLACE FUNCTION complete_user_onboarding(
    user_id UUID,
    user_role user_role,
    additional_data JSONB DEFAULT '{}'::jsonb
) RETURNS BOOLEAN AS $$
BEGIN
    -- Update profile with role and mark as onboarded
    UPDATE profiles 
    SET role = user_role, is_onboarded = true
    WHERE id = user_id;
    
    -- Insert into role-specific table based on role
    IF user_role = 'doctor' THEN
        INSERT INTO doctors (id, specialization, license_number)
        VALUES (
            user_id, 
            COALESCE(additional_data->>'specialization', 'General Medicine'),
            COALESCE(additional_data->>'license_number', 'LIC-' || user_id)
        );
    ELSIF user_role = 'patient' THEN
        INSERT INTO patients (id, date_of_birth, gender, contact_number, address, blood_group)
        VALUES (
            user_id,
            COALESCE((additional_data->>'date_of_birth')::date, CURRENT_DATE),
            COALESCE((additional_data->>'gender')::gender, 'other'),
            additional_data->>'contact_number',
            additional_data->>'address',
            additional_data->>'blood_group'
        );
    ELSIF user_role = 'staff' THEN
        INSERT INTO staff (id, department, position)
        VALUES (
            user_id,
            COALESCE(additional_data->>'department', 'General'),
            COALESCE(additional_data->>'position', 'Staff')
        );
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update policies to allow users to update their own onboarding status
CREATE POLICY "Users can update their own onboarding status" ON profiles
    FOR UPDATE USING (
        auth.uid() = id OR
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- Add performance index for onboarding status
CREATE INDEX idx_profiles_is_onboarded ON profiles(is_onboarded);
