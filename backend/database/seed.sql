-- Sample data for testing
-- Insert a sample survey with questions

INSERT INTO surveys (title, description, created_by, is_active) VALUES 
('Customer Satisfaction Survey', 'Help us improve our services by sharing your feedback', 1, true);

INSERT INTO questions (survey_id, question_text, question_description, question_type, options, is_required, order_index) VALUES
(1, 'What is your name?', 'Please provide your full name', 'text', null, true, 1),
(1, 'How would you rate our service?', 'Rate from 1-5 stars', 'radio', '[{"value": "1", "label": "1 Star"}, {"value": "2", "label": "2 Stars"}, {"value": "3", "label": "3 Stars"}, {"value": "4", "label": "4 Stars"}, {"value": "5", "label": "5 Stars"}]', true, 2),
(1, 'What features would you like to see?', 'Select all that apply', 'checkbox', '[{"value": "mobile_app", "label": "Mobile App"}, {"value": "faster_support", "label": "Faster Support"}, {"value": "more_features", "label": "More Features"}, {"value": "better_ui", "label": "Better User Interface"}]', false, 3),
(1, 'Additional feedback', 'Share any additional thoughts or suggestions', 'textarea', null, false, 4),
(1, 'Your email', 'We may follow up with you', 'email', null, false, 5);
