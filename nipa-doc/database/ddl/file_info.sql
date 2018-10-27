--
-- Type: TABLE;
-- Name: file_info;
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

ALTER TABLE IF EXISTS ONLY public.file_info DROP CONSTRAINT IF EXISTS file_info_pk;
DROP TABLE IF EXISTS public.file_info;

--
-- 파일 관리
--

CREATE TABLE public.file_info (
	file_info_id bigint NOT NULL,
	map_note_id bigint,
	user_id character varying(32),
	job_type character varying(50),
	view_order integer DEFAULT 1,
	file_name character varying(100) NOT NULL,
	file_real_name character varying(100) NOT NULL,
	file_path character varying(256) NOT NULL,
	file_size character varying(12) NOT NULL,
	file_ext character varying(10) NOT NULL,
	thumbnail_name character varying(100) NOT NULL,
	thumbnail_path character varying(100) NOT NULL,
	file_width varchar(8),
	file_height varchar(8),
	update_date timestamp with time zone DEFAULT now(),
	insert_date timestamp with time zone DEFAULT now()
);

--
-- Type: COMMENT;
--

COMMENT ON TABLE public.file_info IS '파일 관리';
COMMENT ON COLUMN public.file_info.file_info_id IS '고유번호';
COMMENT ON COLUMN public.file_info.map_note_id IS '맵노트 고유번호';
COMMENT ON COLUMN public.file_info.user_id IS '사용자 아이디';
COMMENT ON COLUMN public.file_info.job_type IS '업무 타입';
COMMENT ON COLUMN public.file_info.view_order IS '나열 순서';
COMMENT ON COLUMN public.file_info.file_name IS '파일 이름';
COMMENT ON COLUMN public.file_info.file_real_name IS '파일 실제 이름';
COMMENT ON COLUMN public.file_info.file_path IS '파일 경로';
COMMENT ON COLUMN public.file_info.file_size IS '파일 사이즈';
COMMENT ON COLUMN public.file_info.file_ext IS '파일 확장자';
COMMENT ON COLUMN public.file_info.thumbnail_name IS '썸네일 파일 이름';
COMMENT ON COLUMN public.file_info.thumbnail_path IS '썸네일 파일 경로';
comment on column public.file_info.file_width is '원본 파일 가로 크기';
comment on column public.file_info.file_height is '원본 파일 세로 크기';
COMMENT ON COLUMN public.file_info.update_date IS '수정일';
COMMENT ON COLUMN public.file_info.insert_date IS '등록일';

--
-- Type: SEQUENCE;
--


--
-- Type: DEFAULT;
--


--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.file_info
    ADD CONSTRAINT file_info_pk PRIMARY KEY (file_info_id);
	
--
-- Type: INDEX;
--


--
-- complete
--

