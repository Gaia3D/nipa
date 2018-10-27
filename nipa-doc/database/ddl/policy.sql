--
-- Type: TABLE;
-- Name: policy;
--

SET statement_timeout = 0;
SET lock_timeout = 0;
--SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
--SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.policy DROP CONSTRAINT IF EXISTS policy_pk;
ALTER TABLE IF EXISTS public.policy ALTER COLUMN policy_id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.policy_id_seq;
DROP TABLE IF EXISTS public.policy;

--
-- 운영정책
--

CREATE TABLE public.policy (
    policy_id integer NOT NULL,
    upload_type character varying(256) DEFAULT ''::character varying,
    upload_max_filesize integer DEFAULT 500,
    upload_max_count integer DEFAULT 8,
    insert_date timestamp with time zone DEFAULT now()
);

--
-- Type: COMMENT;
--

COMMENT ON TABLE public.policy IS '운영정책';
COMMENT ON COLUMN public.policy.policy_id IS '고유번호';
COMMENT ON COLUMN public.policy.upload_type IS '업로딩 가능 확장자';
COMMENT ON COLUMN public.policy.upload_max_filesize IS '최대 업로딩 사이즈(단위M)';
COMMENT ON COLUMN public.policy.upload_max_count IS '1회 최대 업로딩 파일 수';
COMMENT ON COLUMN public.policy.insert_date IS '등록일';

--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.policy_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Type: DEFAULT;
--

ALTER TABLE ONLY public.policy ALTER COLUMN policy_id SET DEFAULT nextval('public.policy_id_seq'::regclass);

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.policy
    ADD CONSTRAINT policy_pk PRIMARY KEY (policy_id);

--
-- Type: INDEX;
--


--
-- complete
--

