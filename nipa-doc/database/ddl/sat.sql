--
-- Type: TABLE;
-- Name: sat;
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

DROP INDEX IF EXISTS public.sidx_sat_footprint_geom;
DROP INDEX IF EXISTS public.sidx_sat_bbox_geom;
DROP INDEX IF EXISTS public.idx_sat;
ALTER TABLE IF EXISTS ONLY public.sat DROP CONSTRAINT IF EXISTS sat_pkey;
ALTER TABLE IF EXISTS public.sat ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.sat_id_seq;
DROP TABLE IF EXISTS public.sat;

--
-- 시계열 위성영상
--

CREATE TABLE public.sat (
    id integer NOT NULL,
    type character varying(16),
    sat_id character varying(64),
    sat character varying(16),
    sensor character varying(16),
    acquisition character varying(14),
    thumbnail character varying(512),
    img character varying(512),
    bbox public.geometry(MultiPolygon,4326),
    footprint public.geometry(MultiPolygon,4326)
);

--
-- Type: COMMENT;
--

COMMENT ON TABLE public.sat IS '시계열 위성영상';
COMMENT ON COLUMN public.sat.type IS '위성영상구분';
COMMENT ON COLUMN public.sat.sat_id IS '영상 아이디';
COMMENT ON COLUMN public.sat.sat IS '위성명';
COMMENT ON COLUMN public.sat.sensor IS '센서명';
COMMENT ON COLUMN public.sat.acquisition IS '촬영일';
COMMENT ON COLUMN public.sat.thumbnail IS '썸네일 위치';
COMMENT ON COLUMN public.sat.img IS '위성영상 위치';
COMMENT ON COLUMN public.sat.bbox IS 'Boundary Box';
COMMENT ON COLUMN public.sat.footprint IS 'Footprint 영역';

--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.sat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Type: DEFAULT;
--

ALTER TABLE ONLY public.sat ALTER COLUMN id SET DEFAULT nextval('public.sat_id_seq'::regclass);

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.sat
    ADD CONSTRAINT sat_pkey PRIMARY KEY (id);
	
--
-- Type: INDEX;
--

CREATE INDEX idx_sat ON public.sat USING btree (acquisition);
CREATE INDEX sidx_sat_bbox_geom ON public.sat USING gist (bbox);
CREATE INDEX sidx_sat_footprint_geom ON public.sat USING gist (footprint);

--
-- complete
--

