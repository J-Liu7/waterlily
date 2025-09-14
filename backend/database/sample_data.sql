-- Sample data for testing the Survey App
-- Run this after creating the main schema

-- Insert a test user (password is 'password123')
INSERT INTO users (email, password_hash, first_name, last_name) VALUES 
('john.doe@example.com', '/LewdBPj/I3mX4z4nu', 'John', 'Doe'),
('jane.smith@example.com', '/LewdBPj/I3mX4z4nu', 'Jane', 'Smith');

-- Insert a sample survey
INSERT INTO surveys (title, description, created_by) VALUES 
('Customer Satisfaction Survey', 'Help us improve our services by sharing your feedback', 1),
('Product Feedback Survey', 'Tell us about your experience with our products', 1);

-- Insert questions for the first survey
INSERT INTO questions (survey_id, question_text, question_description, question_type, options, is_required, order_index) VALUES 
(1, 'How satisfied are you with our service?', 'Please rate your overall satisfaction', 'radio', '[{"value":"very_satisfied","label":"Very Satisfied"},{"value":"satisfied","label":"Satisfied"},{"value":"neutral","label":"Neutral"},{"value":"dissatisfied","label":"Dissatisfied"},{"value":"very_dissatisfied","label":"Very Dissatisfied"}]', true, 1),
(1, 'What is your name?', null, 'text', null, true, 2),
(1, 'What is your email address?', 'We will use this to follow up if needed', 'email', null, true, 3),
(1, 'How did you hear about us?', 'Select all that apply', 'checkbox', '[{"value":"social_media","label":"Social Media"},{"value":"search_engine","label":"Search Engine"},{"value":"word_of_mouth","label":"Word of Mouth"},{"value":"advertising","label":"Advertising"},{"value":"other","label":"Other"}]', false, 4),
(1, 'Additional comments or suggestions', 'Please share any additional feedback', 'textarea', null, false, 5);

-- Insert questions for the second survey
INSERT INTO questions (survey_id, question_text, question_description, question_type, options, is_required, order_index) VALUES 
(2, 'Which product are you reviewing?', null, 'select', '[{"value":"product_a","label":"Product A"},{"value":"product_b","label":"Product B"},{"value":"product_c","label":"Product C"}]', true, 1),
(2, 'How long have you been using this product?', null, 'radio', '[{"value":"less_than_month","label":"Less than a month"},{"value":"1_3_months","label":"1-3 months"},{"value":"3_6_months","label":"3-6 months"},{"value":"6_12_months","label":"6-12 months"},{"value":"over_year","label":"Over a year"}]', true, 2),
(2, 'Rate the product quality (1-10)', 'Where 1 is poor and 10 is excellent', 'number', null, true, 3),
(2, 'When did you first purchase this product?', null, 'date', null, false, 4),
(2, 'Would you recommend this product to others?', null, 'radio', '[{"value":"definitely","label":"Definitely"},{"value":"probably","label":"Probably"},{"value":"not_sure","label":"Not sure"},{"value":"probably_not","label":"Probably not"},{"value":"definitely_not","label":"Definitely not"}]', true, 5);

-- Insert a sample response from the second user to the first survey
INSERT INTO survey_responses (survey_id, user_id) VALUES (1, 2);

-- Insert the question responses
INSERT INTO question_responses (survey_response_id, question_id, response_value) VALUES 
(1, 1, 'satisfied'),
(1, 2, 'Jane Smith'),
(1, 3, 'jane.smith@example.com'),
(1, 4, 'social_media,word_of_mouth'),
(1, 5, 'Great service overall, but could improve response time.');
