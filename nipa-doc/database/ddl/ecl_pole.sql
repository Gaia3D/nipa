--
-- Type: TABLE;
-- Name: ecl_pole;
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

DROP INDEX IF EXISTS public.sidx_ecl_pole_geom;
DROP INDEX IF EXISTS public.ecl_pole_tp_code_idx;
ALTER TABLE IF EXISTS ONLY public.ecl_pole DROP CONSTRAINT IF EXISTS ecl_pole_pkey;
ALTER TABLE IF EXISTS public.ecl_pole ALTER COLUMN gid DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.ecl_pole_gid_seq;
DROP TABLE IF EXISTS public.ecl_pole;
SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 222 (class 1259 OID 50334)
-- Name: ecl_pole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ecl_pole (
	gid integer NOT NULL,
	geom public.geometry(Point,4326), -- 전주 위치 (WGS84 경위도)
	sido character varying(64), -- 시도 코드
	sgg character varying(64), -- 시군구 코드
	emd character varying(64), -- 읍면동 코드
	adm_code character varying(64), -- 행정구역 코드
	tp_code character varying(8), -- 전산번호 (통합검색 키워드)
	utm character varying(64), -- UTM 좌표
	mgrs character varying(64), -- 군사좌표 (MGRS)
	lon double precision, -- 경도
	lat double precision, -- 위도(북위)
	x_min double precision,
	y_min double precision,
	x_max double precision,
	y_max double precision
);

--
-- Type: COMMENT;
--

COMMENT ON TABLE public.ecl_pole IS '전주전산화번호';
COMMENT ON COLUMN public.ecl_pole.geom IS '전주 위치 (WGS84 경위도)';
COMMENT ON COLUMN public.ecl_pole.sido IS '시도 코드';
COMMENT ON COLUMN public.ecl_pole.sgg IS '시군구 코드';
COMMENT ON COLUMN public.ecl_pole.emd IS '읍면동 코드';
COMMENT ON COLUMN public.ecl_pole.adm_code IS '행정구역 코드';
COMMENT ON COLUMN public.ecl_pole.tp_code IS '전산번호 (통합검색 키워드)';
COMMENT ON COLUMN public.ecl_pole.utm IS 'UTM 좌표';
COMMENT ON COLUMN public.ecl_pole.mgrs IS '군사좌표 (MGRS)';
COMMENT ON COLUMN public.ecl_pole.lon IS '경도';
COMMENT ON COLUMN public.ecl_pole.lat IS '위도(북위)';

--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.ecl_pole_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
--
-- Type: DEFAULT;
--

ALTER TABLE ONLY public.ecl_pole ALTER COLUMN gid SET DEFAULT nextval('public.ecl_pole_gid_seq'::regclass);

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.ecl_pole
    ADD CONSTRAINT ecl_pole_pkey PRIMARY KEY (gid);

--
-- Type: INDEX;
--

CREATE INDEX ecl_pole_tp_code_idx ON public.ecl_pole USING btree (tp_code text_pattern_ops);
CREATE INDEX sidx_ecl_pole_geom ON public.ecl_pole USING gist (geom);

--
-- complete
--

