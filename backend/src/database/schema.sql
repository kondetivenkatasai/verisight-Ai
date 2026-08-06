-- ============================================================
-- Aegis AI — Database Schema for Supabase PostgreSQL
-- Copy and paste this directly into your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100)    NOT NULL,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    role        VARCHAR(20)     NOT NULL DEFAULT 'user'
                CHECK (role IN ('user', 'admin')),
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Users Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. CASES TABLE
CREATE TABLE IF NOT EXISTS cases (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(200)    NOT NULL,
    description TEXT            NOT NULL,
    priority    VARCHAR(20)     NOT NULL DEFAULT 'medium'
                CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status      VARCHAR(20)     NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'in_progress', 'completed', 'archived')),
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Cases Indexes
CREATE INDEX IF NOT EXISTS idx_cases_user_id  ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status   ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_priority ON cases(priority);
CREATE INDEX IF NOT EXISTS idx_cases_created  ON cases(created_at DESC);

-- 3. UPLOADED FILES TABLE
CREATE TABLE IF NOT EXISTS uploaded_files (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id     UUID            NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    filename    VARCHAR(255)    NOT NULL,
    filetype    VARCHAR(100)    NOT NULL,
    storage_url TEXT            NOT NULL,
    uploaded_at TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- UploadedFiles Indexes
CREATE INDEX IF NOT EXISTS idx_uploaded_files_case_id ON uploaded_files(case_id);

-- 4. WORKFLOW HISTORY TABLE
CREATE TABLE IF NOT EXISTS workflow_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id         UUID            NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    agent_name      VARCHAR(50)     NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    confidence      DECIMAL(5,2)    DEFAULT 0,
    execution_time  INTEGER         DEFAULT 0, -- in milliseconds
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- WorkflowHistory Indexes
CREATE INDEX IF NOT EXISTS idx_workflow_case_id    ON workflow_history(case_id);
CREATE INDEX IF NOT EXISTS idx_workflow_agent_name ON workflow_history(agent_name);
CREATE INDEX IF NOT EXISTS idx_workflow_status     ON workflow_history(status);

-- 5. REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id         UUID            NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    summary         TEXT            NOT NULL,
    decision        VARCHAR(50)     NOT NULL DEFAULT 'needs_review'
                    CHECK (decision IN ('approved', 'rejected', 'needs_review', 'escalate')),
    risk_score      DECIMAL(5,2)    DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    recommendation  TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Reports Indexes
CREATE INDEX IF NOT EXISTS idx_reports_case_id  ON reports(case_id);
CREATE INDEX IF NOT EXISTS idx_reports_decision ON reports(decision);

-- ============================================================
-- Row Level Security (RLS) Configuration
-- ============================================================
ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases           ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files   ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports         ENABLE ROW LEVEL SECURITY;

-- Allow users to query their own records (if connecting via anon client)
CREATE POLICY "Users can select own user row"
    ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can select own cases"
    ON cases FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cases"
    ON cases FOR INSERT WITH CHECK (auth.uid() = user_id);
