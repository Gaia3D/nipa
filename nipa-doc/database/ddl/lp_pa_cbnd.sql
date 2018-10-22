--
-- Type: TABLE;
-- Name: lp_pa_cbnd;
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

DROP INDEX IF EXISTS public.sidx_lp_pa_cbnd_geom;
DROP INDEX IF EXISTS public.lp_pa_cbnd_pnu_idx;
ALTER TABLE IF EXISTS ONLY public.sat DROP CONSTRAINT IF EXISTS lp_pa_cbnd_pkey;
ALTER TABLE IF EXISTS public.lp_pa_cbnd ALTER COLUMN gid DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.lp_pa_cbnd_gid_seq;
DROP TABLE IF EXISTS public.lp_pa_cbnd;

--
-- 지적도
--

CREATE TABLE public.lp_pa_cbnd (
	gid integer NOT NULL,
	geom public.geometry(MultiPolygon,4326),
	pnu character varying(19), -- PNU 코드(주소검색 키워드)
	jibun character varying(19), -- 지번, 지목
	bchk character varying(1),
	sgg_oid bigint,
	col_adm_se character varying(5) -- 읍면동 코드
);


--
-- Type: COMMENT;
--

COMMENT ON TABLE public.lp_pa_cbnd IS '지적도';
COMMENT ON COLUMN public.lp_pa_cbnd.pnu IS 'PNU 코드(주소검색 키워드)';
COMMENT ON COLUMN public.lp_pa_cbnd.jibun IS '지번, 지목';
COMMENT ON COLUMN public.lp_pa_cbnd.col_adm_se IS '읍면동 코드';

--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.lp_pa_cbnd_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
--
-- Type: DEFAULT;
--

ALTER TABLE ONLY public.lp_pa_cbnd ALTER COLUMN gid SET DEFAULT nextval('public.lp_pa_cbnd_gid_seq'::regclass);

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.lp_pa_cbnd
    ADD CONSTRAINT lp_pa_cbnd_pkey PRIMARY KEY (gid);
	
--
-- Type: INDEX;
--

CREATE INDEX lp_pa_cbnd_pnu_idx ON public.lp_pa_cbnd USING btree (pnu text_pattern_ops);
CREATE INDEX sidx_lp_pa_cbnd_geom ON public.lp_pa_cbnd USING gist (geom);

--
-- complete
--

