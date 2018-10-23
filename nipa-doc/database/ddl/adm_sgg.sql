--
-- Type: TABLE;
-- Name: adm_sgg;
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

DROP INDEX IF EXISTS public.sidx_adm_sgg_geom;
DROP INDEX IF EXISTS public.idx_adm_sgg_kor_nm;
DROP INDEX IF EXISTS public.idx_adm_sgg_cd;
ALTER TABLE IF EXISTS ONLY public.adm_sgg DROP CONSTRAINT IF EXISTS adm_sgg_pkey;
ALTER TABLE IF EXISTS public.adm_sgg ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.adm_sgg_id_seq;
DROP TABLE IF EXISTS public.adm_sgg;

--
-- 시군구(남한)
--

CREATE TABLE public.adm_sgg (
    id integer NOT NULL,
    geom public.geometry(MultiPolygon,4326),
    sgg_cd character varying(5),
    sgg_eng_nm character varying(40),
    sgg_kor_nm character varying(40)
);

--
-- Type: COMMENT;
--


--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.adm_sgg_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Type: DEFAULT;
--

ALTER TABLE ONLY public.adm_sgg ALTER COLUMN id SET DEFAULT nextval('public.adm_sgg_id_seq'::regclass);

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.adm_sgg
    ADD CONSTRAINT adm_sgg_pkey PRIMARY KEY (id);

--
-- Type: INDEX;
--

CREATE INDEX idx_adm_sgg_cd ON public.adm_sgg USING btree (sgg_cd);
CREATE INDEX idx_adm_sgg_kor_nm ON public.adm_sgg USING btree (sgg_kor_nm);
CREATE INDEX sidx_adm_sgg_geom ON public.adm_sgg USING gist (geom);

--
-- complete
--

