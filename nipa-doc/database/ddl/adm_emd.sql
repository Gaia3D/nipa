-- adm_sido
DROP SEQUENCE public.adm_sido_id_seq;
drop table if exists public.adm_sido cascade;

CREATE SEQUENCE public.adm_sido_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 17 CACHE 1;
CREATE TABLE public.adm_sido (
	id integer NOT NULL DEFAULT nextval('adm_emd_id_seq'),
	geom geometry(MultiPolygon,4326),
	emd_cd character varying(10),
	emd_eng_nm character varying(40),
	emd_kor_nm character varying(40),
	CONSTRAINT adm_emd_pkey PRIMARY KEY (id)
);


ALTER TABLE public.adm_sido_id_seq OWNER TO postgres;


-- adm_emd
DROP SEQUENCE public.adm_emd_id_seq;
drop table if exists public.adm_emd cascade;

DROP INDEX public.idx_adm_emd_cd;
DROP INDEX public.idx_adm_emd_kor_nm;
DROP INDEX public.sidx_adm_emd_geom;

CREATE SEQUENCE public.adm_emd_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 5046 CACHE 1;
CREATE TABLE public.adm_emd (
	id integer NOT NULL DEFAULT nextval('adm_emd_id_seq'),
	geom geometry(MultiPolygon,4326),
	emd_cd character varying(10),
	emd_eng_nm character varying(40),
	emd_kor_nm character varying(40),
	CONSTRAINT adm_emd_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_adm_emd_cd ON public.adm_emd USING btree(emd_cd);
CREATE INDEX idx_adm_emd_kor_nm ON public.adm_emd USING btree (emd_kor_nm);
CREATE INDEX sidx_adm_emd_geom ON public.adm_emd USING gist(geom);


ALTER TABLE public.adm_emd OWNER TO postgres;
ALTER TABLE public.adm_emd_id_seq OWNER TO postgres;



