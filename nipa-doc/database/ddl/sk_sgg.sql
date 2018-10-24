--
-- Type: TABLE;
-- Name: sk_sgg;
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

DROP INDEX IF EXISTS public.sidx_sk_sgg_geom;
ALTER TABLE IF EXISTS ONLY public.sk_sgg DROP CONSTRAINT IF EXISTS sk_sgg_pkey;
ALTER TABLE IF EXISTS public.sk_sgg ALTER COLUMN gid DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.sk_sgg_gid_seq;
DROP TABLE IF EXISTS public.sk_sgg;

--
-- 시군구(남한)
--

CREATE TABLE public.sk_sgg (
    gid integer NOT NULL,
    ufid character varying(34),
    bjcd character varying(10),
    name character varying(100),
    divi character varying(6),
    scls character varying(8),
    fmta character varying(9),
    geom public.geometry(MultiPolygon,4326)
);

--
-- Type: COMMENT;
--


--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.sk_sgg_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Type: DEFAULT;
--

ALTER TABLE ONLY public.sk_sgg ALTER COLUMN gid SET DEFAULT nextval('public.sk_sgg_gid_seq'::regclass);

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.sk_sgg
    ADD CONSTRAINT sk_sgg_pkey PRIMARY KEY (gid);

--
-- Type: INDEX;
--

CREATE INDEX sidx_sk_sgg_geom ON public.sk_sgg USING gist (geom);

--
-- complete
--

