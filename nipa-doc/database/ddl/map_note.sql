--
-- Type: TABLE;
-- Name: map_note;
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.map_note DROP CONSTRAINT IF EXISTS map_note_pk;
ALTER TABLE IF EXISTS public.map_note ALTER COLUMN map_note_id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.map_note_map_note_id_seq;
DROP TABLE IF EXISTS public.map_note;

--
-- 맵노트
--

CREATE TABLE public.map_note (
    map_note_id bigint NOT NULL,
    user_id character varying(32),
    note_title character varying(256) NOT NULL,
    description character varying(4000) DEFAULT ''::character varying,
    note_location public.geography(Point,4326),
    latitude numeric(13,10) NOT NULL,
    longitude numeric(13,10) NOT NULL,
    height numeric(7,3) DEFAULT 0,
    update_date timestamp with time zone DEFAULT now(),
    insert_date timestamp with time zone DEFAULT now()
);

--
-- Type: COMMENT;
--

COMMENT ON TABLE public.map_note IS '맵노트';
COMMENT ON COLUMN public.map_note.map_note_id IS '고유번호';
COMMENT ON COLUMN public.map_note.user_id IS '사용자 아이디';
COMMENT ON COLUMN public.map_note.note_title IS '지점명';
COMMENT ON COLUMN public.map_note.description IS '설명';
COMMENT ON COLUMN public.map_note.note_location IS 'location(위도, 경도)';
COMMENT ON COLUMN public.map_note.latitude IS '위도';
COMMENT ON COLUMN public.map_note.longitude IS '경도';
COMMENT ON COLUMN public.map_note.height IS '높이';
COMMENT ON COLUMN public.map_note.update_date IS '수정일';
COMMENT ON COLUMN public.map_note.insert_date IS '등록일';

--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.map_note_map_note_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
--
-- Type: DEFAULT;
--

ALTER TABLE ONLY public.map_note ALTER COLUMN map_note_id SET DEFAULT nextval('public.map_note_map_note_id_seq'::regclass);

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.map_note
    ADD CONSTRAINT map_note_pk PRIMARY KEY (map_note_id);
	
--
-- Type: INDEX;
--


--
-- complete
--

