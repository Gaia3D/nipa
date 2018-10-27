--
-- Type: TABLE;
-- Name: map_note_detail;
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

ALTER TABLE IF EXISTS ONLY public.map_note_detail DROP CONSTRAINT IF EXISTS map_note_detail_pk;
ALTER TABLE IF EXISTS public.map_note_detail ALTER COLUMN map_note_detail_id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.map_note_detail_map_note_detail_id_seq;
DROP TABLE IF EXISTS public.map_note_detail;

--
-- 맵노트 상세
--

CREATE TABLE public.map_note_detail (
    map_note_detail_id bigint NOT NULL,
    map_note_id bigint,
    place_name character varying(300) NOT NULL,
    description character varying(4000),
    update_date timestamp with time zone DEFAULT now(),
    insert_date timestamp with time zone DEFAULT now()
);

--
-- Type: COMMENT;
--

COMMENT ON TABLE public.map_note_detail IS '맵노트 상세';
COMMENT ON COLUMN public.map_note_detail.map_note_detail_id IS '고유번호';
COMMENT ON COLUMN public.map_note_detail.map_note_id IS '맵노트 고유번호';
COMMENT ON COLUMN public.map_note_detail.place_name IS '지점명';
COMMENT ON COLUMN public.map_note_detail.description IS '설명';
COMMENT ON COLUMN public.map_note_detail.update_date IS '수정일';
COMMENT ON COLUMN public.map_note_detail.insert_date IS '등록일';

--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.map_note_detail_map_note_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Type: DEFAULT;
--


--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.map_note_detail
    ADD CONSTRAINT map_note_detail_pk PRIMARY KEY (map_note_detail_id);

--
-- Type: INDEX;
--


--
-- complete
--

