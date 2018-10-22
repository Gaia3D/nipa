--
-- Type: TABLE;
-- Name: addr_jibun;
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

DROP TABLE IF EXISTS public.addr_jibun;

--
-- 지번 주소
--

CREATE TABLE public.addr_jibun (
	code_law character varying(10), -- 법정동코드
	kname_sido character varying(40), -- 시도명
	kname_sgg character varying(40), -- 시군구명
	kname_emd character varying(40), -- 읍면동명
	kname_li character varying(40), -- 리명
	is_mnt character varying(1), -- 산여부
	jibun_no1 character varying(4), -- 지번본번
	jibun_no2 character varying(4), -- 지번부번
	code_addr character varying(12), -- 도로명코드
	basement character varying(1), -- 지하여부
	building_no1 integer, -- 건물본번
	building_no2 integer, -- 건물부번
	jibun_seq character varying(10), -- 지번일련번호
	ename_sido character varying(40), -- 시도명(영문)
	ename_sgg character varying(40), -- 시군구명(영문)
	ename_emd character varying(40), -- 읍면동명(영문)
	ename_li character varying(40), -- 리명(영문)
	code_mv character varying(2),
	building_mno character varying(25), -- 건물관리번호
	code_emd character varying(10) -- 주소관할읍면동코드
);

--
-- Type: COMMENT;
--

COMMENT ON TABLE public.addr_jibun IS '지번주소';
COMMENT ON COLUMN public.addr_jibun.code_law IS '법정동코드';
COMMENT ON COLUMN public.addr_jibun.kname_sido IS '시도명';
COMMENT ON COLUMN public.addr_jibun.kname_sgg IS '시군구명';
COMMENT ON COLUMN public.addr_jibun.kname_emd IS '읍면동명';
COMMENT ON COLUMN public.addr_jibun.kname_li IS '리명';
COMMENT ON COLUMN public.addr_jibun.is_mnt IS '산여부';
COMMENT ON COLUMN public.addr_jibun.jibun_no1 IS '지번본번';
COMMENT ON COLUMN public.addr_jibun.jibun_no2 IS '지번부번';
COMMENT ON COLUMN public.addr_jibun.code_addr IS '도로명코드';
COMMENT ON COLUMN public.addr_jibun.basement IS '지하여부';
COMMENT ON COLUMN public.addr_jibun.building_no1 IS '건물본번';
COMMENT ON COLUMN public.addr_jibun.building_no2 IS '건물부번';
COMMENT ON COLUMN public.addr_jibun.jibun_seq IS '지번일련번호';
COMMENT ON COLUMN public.addr_jibun.ename_sido IS '시도명(영문)';
COMMENT ON COLUMN public.addr_jibun.ename_sgg IS '시군구명(영문)';
COMMENT ON COLUMN public.addr_jibun.ename_emd IS '읍면동명(영문)';
COMMENT ON COLUMN public.addr_jibun.ename_li IS '리명(영문)';
COMMENT ON COLUMN public.addr_jibun.building_mno IS '건물관리번호';
COMMENT ON COLUMN public.addr_jibun.code_emd IS '주소관할읍면동코드';

--
-- Type: SEQUENCE;
--


--
-- Type: DEFAULT;
--


--
-- Type: CONSTRAINT;
--


--
-- Type: INDEX;
--


--
-- complete
--

