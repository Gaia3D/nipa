--
-- Type: TABLE;
-- Name: timeseries;
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

DROP INDEX IF EXISTS public.spatial_timeseries_the_geom;
DROP INDEX IF EXISTS public.sidx_timeseries_footprint_geom;
DROP INDEX IF EXISTS public.sidx_timeseries_bbox_geom;
DROP INDEX IF EXISTS public.idx_timeseries;
ALTER TABLE IF EXISTS ONLY public.timeseries DROP CONSTRAINT IF EXISTS timeseries_pkey;
ALTER TABLE IF EXISTS public.timeseries ALTER COLUMN fid DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.timeseries_fid_seq;
DROP TABLE IF EXISTS public.timeseries;

--
-- 시계열 위성영상
--

CREATE TABLE public.timeseries (
    fid integer NOT NULL,
    location character varying(255),
    the_geom public.geometry(Polygon,4326),
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

COMMENT ON TABLE public.timeseries IS '시계열 위성영상';
COMMENT ON COLUMN public.timeseries.type IS '위성영상구분';
COMMENT ON COLUMN public.timeseries.sat_id IS '영상 아이디';
COMMENT ON COLUMN public.timeseries.sat IS '위성명';
COMMENT ON COLUMN public.timeseries.sensor IS '센서명';
COMMENT ON COLUMN public.timeseries.acquisition IS '촬영일';
COMMENT ON COLUMN public.timeseries.thumbnail IS '썸네일 위치';
COMMENT ON COLUMN public.timeseries.img IS '위성영상 위치';
COMMENT ON COLUMN public.timeseries.bbox IS 'Boundary Box';
COMMENT ON COLUMN public.timeseries.footprint IS 'Footprint 영역';

--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.timeseries_fid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Type: DEFAULT;
--

ALTER TABLE ONLY public.timeseries ALTER COLUMN fid SET DEFAULT nextval('public.timeseries_fid_seq'::regclass);

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.timeseries
    ADD CONSTRAINT timeseries_pkey PRIMARY KEY (fid);
	
--
-- Type: INDEX;
--

CREATE INDEX spatial_timeseries_the_geom ON public.timeseries USING gist (the_geom);
CREATE INDEX idx_timeseries ON public.timeseries USING btree (acquisition);
CREATE INDEX sidx_timeseries_bbox_geom ON public.timeseries USING gist (bbox);
CREATE INDEX sidx_timeseries_footprint_geom ON public.timeseries USING gist (footprint);

--
-- complete
--

