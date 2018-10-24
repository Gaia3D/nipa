--
-- Type: TABLE;
-- Name: gstn_pmntn_ln;
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

ALTER TABLE IF EXISTS ONLY public.gstn_pmntn_ln DROP CONSTRAINT IF EXISTS gstn_pmntn_ln_pkery;
ALTER TABLE IF EXISTS public.gstn_pmntn_ln ALTER COLUMN gid DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.gstn_pmntn_ln_gid_seq;
DROP TABLE IF EXISTS public.gstn_pmntn_ln;

--
--
--

CREATE TABLE public.gstn_pmntn_ln (
	gid integer NOT NULL,
	geom public.geometry(MultiLineString,4326),
	objectid integer,
	id_cd character varying(12),
	po_cd character varying(4),
	class_cd character varying(4),
	seqno character varying(4),
	course_id character varying(4), -- 코스 ID
	st_nd_id integer,
	ed_nd_id integer,
	cos_kor_nm character varying(50), -- 코스명(한글)
	cos_eng_nm character varying(50), -- 코스명(영문)
	detail_cos character varying(100), -- 코스 상세
	cos_schdul character varying(1),
	forward_tm integer,
	reverse_tm integer,
	sat_cnt_a integer,
	pdop_a double precision,
	hdop_a double precision,
	vdop_a double precision,
	rec_sen integer,
	use_yn character varying(1), -- 사용여부
	leng double precision, -- 길이
	difficulty double precision, -- 난이도
	dplct_yn character varying(1),
	sctn1_id character varying(4),
	sctn2_id character varying(4),
	sctn3_id character varying(4),
	shape_leng double precision,
	rttdr_yn integer,
	sprng_nt character varying(50), -- 봄 입산가능여부
	inspect integer, -- 점검여부
	autumn_nt character varying(50) -- 가을 입산가능여부
);

--
-- Type: COMMENT;
--

COMMENT ON TABLE public.gstn_pmntn_ln IS '탐장로';
COMMENT ON COLUMN public.gstn_pmntn_ln.course_id IS '코스 ID';
COMMENT ON COLUMN public.gstn_pmntn_ln.cos_kor_nm IS '코스명(한글)';
COMMENT ON COLUMN public.gstn_pmntn_ln.cos_eng_nm IS '코스명(영문)';
COMMENT ON COLUMN public.gstn_pmntn_ln.detail_cos IS '코스 상세';
COMMENT ON COLUMN public.gstn_pmntn_ln.use_yn IS '사용여부';
COMMENT ON COLUMN public.gstn_pmntn_ln.leng IS '길이';
COMMENT ON COLUMN public.gstn_pmntn_ln.difficulty IS '난이도';
COMMENT ON COLUMN public.gstn_pmntn_ln.sprng_nt IS '봄 입산가능여부';
COMMENT ON COLUMN public.gstn_pmntn_ln.inspect IS '점검여부';
COMMENT ON COLUMN public.gstn_pmntn_ln.autumn_nt IS '가을 입산가능여부';

--
-- Type: SEQUENCE;
--

CREATE SEQUENCE public.gstn_pmntn_ln_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
--
-- Type: DEFAULT;
--

ALTER TABLE ONLY public.gstn_pmntn_ln ALTER COLUMN gid SET DEFAULT nextval('public.gstn_pmntn_ln_gid_seq'::regclass);
 
--
-- Type: CONSTRAINT;
--

ALTER TABLE ONLY public.gstn_pmntn_ln
    ADD CONSTRAINT gstn_pmntn_ln_pkery PRIMARY KEY (gid);

--
-- Type: INDEX;
--


--
-- complete
--

