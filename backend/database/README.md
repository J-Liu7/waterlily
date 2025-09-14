# Database Schema Design

## Overview
This PostgreSQL database schema is designed to support a flexible survey application with user authentication and comprehensive survey response tracking.

## Schema Design Decisions

### 1. Users Table
- **Primary Key**: Serial ID for performance and simplicity
- **Email**: Unique constraint for authentication
- **Password**: Stored as hash for security
- **Timestamps**: Track creation and updates for auditing

### 2. Surveys Table
- **Ownership**: Foreign key to users table for survey creation
- **Soft Delete**: is_active boolean instead of hard deletion
- **Flexibility**: Simple title/description structure

### 3. Questions Table
- **Order Management**: order_index with unique constraint per survey
- **Flexible Types**: Enum constraint for supported question types
- **Options Storage**: JSONB for flexible option storage (radio, checkbox, select)
- **Validation**: is_required flag for frontend validation

### 4. Response Tables (Two-table approach)
- **survey_responses**: One record per user per survey (prevents duplicates)
- **question_responses**: Individual answers linked to survey response
- **Benefits**: 
  - Normalized structure
  - Easy to query all responses for a survey
  - Supports partial responses
  - Maintains referential integrity

## Indexing Strategy

### Performance Indexes
- users.email: Fast authentication lookups
- surveys.created_by: Quick survey listing by user
- surveys.is_active: Filter active surveys efficiently
- questions.survey_id: Fast question retrieval for surveys
- questions.(survey_id, order_index): Ordered question display

### Data Integrity Indexes
- survey_responses.(survey_id, user_id): Enforce unique responses
- question_responses.survey_response_id: Fast response aggregation
- question_responses.question_id: Question-level analytics

## Scalability Considerations

1. **Partitioning Ready**: Tables can be partitioned by date if response volume grows
2. **Archival Strategy**: Soft deletes allow for data archival workflows
3. **Analytics Friendly**: Structure supports reporting queries
4. **JSONB Options**: Efficient storage and querying of dynamic question options

## Security Features

1. **Cascading Deletes**: Maintain referential integrity
2. **Password Hashing**: Never store plain text passwords
3. **Audit Trail**: Timestamps on all major tables
4. **Data Isolation**: User-based data access patterns

## Question Types Supported

- 	ext: Short text input
- 	extarea: Long text input  
- adio: Single choice from options
- checkbox: Multiple choices from options
- select: Dropdown selection
- 
umber: Numeric input
- email: Email validation
- date: Date picker

The schema balances flexibility, performance, and data integrity while remaining simple enough for rapid development.
