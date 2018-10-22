--
-- Type: TABLE;
-- Name: place_num;
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

DROP INDEX IF EXISTS public.sidx_place_num_geom;
DROP INDEX IF EXISTS public.place_num_spo_no_cd_idx;
DROP INDEX IF EXISTS public.place_num_fcltylc_nm_idx;
ALTER TABLE IF EXISTS ONLY public.place_num DROP CONSTRAINT IF EXISTS place_num_pkey;
ALTER TABLE IF EXISTS public.place_num ALTER COLUMN gid DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.place_num_gid_seq;
DROP TABLE IF EXISTS public.place_num;

--
-- 지점번호
--

CREATE TABLE public.place_num (
	gid integer NOT NULL,
	geom public.geometry(MultiPoint,4326), -- 지점 번호 위치
	sgg_cd character varying(5), -- 시군구 코드
	emd_cd character varying(8), -- 읍면동 코드
	li_cd character varying(10), -- 리 코드
	spo_fcl_cd bigint, -- 지점 순번
	spo_no_cd character varying(12), -- 지점 번호 코드(통합검색 키워드)
	ins_fcl_sn character varying(30), -- 지점명 코드 순번
	fcltylc_nm character varying(200), -- 지점명(통합검색 키워드)
	grs80_x double precision, -- GRS80 X
	grs80_y double precision, -- GRS80 Y
	lon double precision, -- 경도
	lat double precision, -- 위도
	spo_ins_date character varying(8) -- 갱신일
);

--
-- Type: COMMENT;
--

COMMENT ON TABLE public.place_num IS '지점번호';
COMMENT ON COLUMN public.place_num.geom IS '지점 번호 위치';
COMMENT ON COLUMN public.place_num.sgg_cd IS '시군구 코드';
COMMENT ON COLUMN public.place_num.emd_cd IS '읍면동 코드';
COMMENT ON COLUMN public.place_num.li_cd IS '리 코드';
COMMENT ON COLUMN public.place_num.spo_fcl_cd IS '지점 순번';
COMMENT ON COLUMN public.place_num.spo_no_cd IS '지점 번호 코드(통합검색 키워드)';
COMMENT ON COLUMN public.place_num.ins_fcl_sn IS '지점명 코드 순번';
COMMENT ON COLUMN public.place_num.fcltylc_nm IS '지점명(통합검색 키워드)';
COMMENT ON COLUMN public.place_num.grs80_x IS 'GRS80 X';
COMMENT ON COLUMN public.place_num.grs80_y IS 'GRS80 Y';
COMMENT ON COLUMN public.place_num.lon IS '경도';
COMMENT ON COLUMN public.place_num.lat IS '위도';
COMMENT ON COLUMN public.place_num.spo_ins_date IS '갱신일';

--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.place_num_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
--
-- Type: DEFAULT;
--

ALTER TABLE ONLY public.place_num ALTER COLUMN gid SET DEFAULT nextval('public.place_num_gid_seq'::regclass);

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.place_num
    ADD CONSTRAINT place_num_pkey PRIMARY KEY (gid);

--
-- Type: INDEX;
--

CREATE INDEX place_num_fcltylc_nm_idx ON public.place_num USING btree (fcltylc_nm text_pattern_ops);
CREATE INDEX place_num_spo_no_cd_idx ON public.place_num USING btree (spo_no_cd text_pattern_ops);
CREATE INDEX sidx_place_num_geom ON public.place_num USING gist (geom);

--
-- complete
--

