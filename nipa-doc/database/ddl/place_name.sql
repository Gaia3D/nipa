--
-- Type: TABLE;
-- Name: place_name;
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

DROP INDEX IF EXISTS public.sidx_place_name_geom;
DROP INDEX IF EXISTS public.place_name_name_ko_idx;
ALTER TABLE IF EXISTS ONLY public.place_name DROP CONSTRAINT IF EXISTS place_name_pkey;
ALTER TABLE IF EXISTS public.place_name ALTER COLUMN gid DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.place_name_gid_seq;
DROP TABLE IF EXISTS public.place_name;

--
-- 지명
--

CREATE TABLE public.place_name (
	gid integer NOT NULL,
	geom public.geometry(MultiPoint,4326), -- 지명 위치
	name_ko character varying(254), -- 한글지명 (검색키워드)
	name_en character varying(254), -- 영문지명
	category character varying(254), -- 구분
	lon double precision, -- 경도
	lat double precision, -- 위도
	utm character varying(64), -- UTM 좌표
	mgrs character varying(64), -- 군사 좌표
	update character varying(8) -- 갱신일
);

--
-- Type: COMMENT;
--

COMMENT ON TABLE public.place_name IS '지명';
COMMENT ON COLUMN public.place_name.geom IS '지명 위치';
COMMENT ON COLUMN public.place_name.name_ko IS '한글지명 (검색키워드)';
COMMENT ON COLUMN public.place_name.name_en IS '영문지명';
COMMENT ON COLUMN public.place_name.category IS '구분';
COMMENT ON COLUMN public.place_name.lon IS '경도';
COMMENT ON COLUMN public.place_name.lat IS '위도';
COMMENT ON COLUMN public.place_name.utm IS 'UTM 좌표';
COMMENT ON COLUMN public.place_name.mgrs IS '군사 좌표';
COMMENT ON COLUMN public.place_name.update IS '갱신일';

--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.place_name_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
--
-- Type: DEFAULT;
--

ALTER TABLE ONLY public.place_name ALTER COLUMN gid SET DEFAULT nextval('public.place_name_gid_seq'::regclass);

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.place_name
    ADD CONSTRAINT place_name_pkey PRIMARY KEY (gid);

--
-- Type: INDEX;
--

CREATE INDEX place_name_name_ko_idx ON public.place_name USING btree (name_ko text_pattern_ops);
CREATE INDEX sidx_place_name_geom ON public.place_name USING gist (geom);

--
-- complete
--

