--
-- Type: TABLE;
-- Name: adm_emd;
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

DROP INDEX IF EXISTS public.sidx_adm_emd_geom;
DROP INDEX IF EXISTS public.idx_adm_emd_kor_nm;
DROP INDEX IF EXISTS public.idx_adm_emd_cd;
ALTER TABLE IF EXISTS ONLY public.adm_emd DROP CONSTRAINT IF EXISTS adm_emd_pkey;
ALTER TABLE IF EXISTS public.adm_emd ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.adm_emd_id_seq;
DROP TABLE IF EXISTS public.adm_emd;

--
-- 읍면동(남한)
--

CREATE TABLE public.adm_emd (
    id integer NOT NULL,
    geom public.geometry(MultiPolygon,4326),
    emd_cd character varying(10),
    emd_eng_nm character varying(40),
    emd_kor_nm character varying(40)
);

--
-- Type: COMMENT;
--


--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.adm_emd_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Type: DEFAULT;
--

ALTER TABLE ONLY public.adm_emd ALTER COLUMN id SET DEFAULT nextval('public.adm_emd_id_seq'::regclass);

--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.adm_emd
    ADD CONSTRAINT adm_emd_pkey PRIMARY KEY (id);

--
-- Type: INDEX;
--

CREATE INDEX idx_adm_emd_cd ON public.adm_emd USING btree (emd_cd);
CREATE INDEX idx_adm_emd_kor_nm ON public.adm_emd USING btree (emd_kor_nm);
CREATE INDEX sidx_adm_emd_geom ON public.adm_emd USING gist (geom);

--
-- complete
--
