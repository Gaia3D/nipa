--
-- Type: TABLE;
-- Name: addr_new;
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

DROP INDEX IF EXISTS public.sidx_addr_new_geom;
DROP TABLE IF EXISTS public.addr_new;

--
-- 도로명 주소
--

CREATE TABLE public.addr_new (
	code_emd character varying(10), -- 주소관할읍면동코드
	kname_sido character varying(40), -- 시도명
	kname_sgg character varying(40), -- 시군구명
	kname_emd character varying(40), -- 읍면동명
	code_addr character varying(12), -- 도로명코드
	name_addr character varying(80), -- 도로명
	basement character varying(1), -- 지하여부
	building_no1 integer, -- 건물본번
	building_no2 integer, -- 건물부번
	zipcode character varying(5), -- 우편번호
	building_mno character varying(25), -- 건물관리번호
	name_sgg_building character varying(40), -- 시군구용건물명
	cat_building character varying(100), -- 건출물용도분류
	code_adm character varying(10), -- 행정동코드
	name_adm character varying(40), -- 행정동명
	ground_floor integer, -- 지상층수
	basement_floor integer, -- 지하층수
	apartment character varying(1), -- 공동주택구분
	count_building integer, -- 건물수
	detail_bname character varying(100), -- 상세건물명
	hist_bname character varying(1000), -- 건물명변경이력
	hist_detail_bname character varying(1000), -- 상세건물명변경이력
	residence character varying(1), -- 거주여부
	center_x double precision, -- 건물중심점_x좌표
	center_y double precision, -- 건물중심점_y좌표
	enterance_x double precision, -- 출입구_x좌표
	enterance_y double precision, -- 출입구_y좌표
	ename_sido character varying(40), -- 시도명(영문)
	ename_sgg character varying(40), -- 시군구명(영문)
	ename_emd character varying(40), -- 읍면동명(영문)
	ename_road character varying(80), -- 도로명(영문)
	is_emd character varying(1), -- 읍면동구분
	code_mv character varying(2), -- 이동사유코드
	geom public.geometry(Point,4326)
);

--
-- Type: COMMENT;
--

COMMENT ON TABLE public.addr_new IS '도로명주소';
COMMENT ON COLUMN public.addr_new.code_emd IS '주소관할읍면동코드';
COMMENT ON COLUMN public.addr_new.kname_sido IS '시도명';
COMMENT ON COLUMN public.addr_new.kname_sgg IS '시군구명';
COMMENT ON COLUMN public.addr_new.kname_emd IS '읍면동명';
COMMENT ON COLUMN public.addr_new.code_addr IS '도로명코드';
COMMENT ON COLUMN public.addr_new.name_addr IS '도로명';
COMMENT ON COLUMN public.addr_new.basement IS '지하여부';
COMMENT ON COLUMN public.addr_new.building_no1 IS '건물본번';
COMMENT ON COLUMN public.addr_new.building_no2 IS '건물부번';
COMMENT ON COLUMN public.addr_new.zipcode IS '우편번호';
COMMENT ON COLUMN public.addr_new.building_mno IS '건물관리번호';
COMMENT ON COLUMN public.addr_new.name_sgg_building IS '시군구용건물명';
COMMENT ON COLUMN public.addr_new.cat_building IS '건출물용도분류';
COMMENT ON COLUMN public.addr_new.code_adm IS '행정동코드';
COMMENT ON COLUMN public.addr_new.name_adm IS '행정동명';
COMMENT ON COLUMN public.addr_new.ground_floor IS '지상층수';
COMMENT ON COLUMN public.addr_new.basement_floor IS '지하층수';
COMMENT ON COLUMN public.addr_new.apartment IS '공동주택구분';
COMMENT ON COLUMN public.addr_new.count_building IS '건물수';
COMMENT ON COLUMN public.addr_new.detail_bname IS '상세건물명';
COMMENT ON COLUMN public.addr_new.hist_bname IS '건물명변경이력';
COMMENT ON COLUMN public.addr_new.hist_detail_bname IS '상세건물명변경이력';
COMMENT ON COLUMN public.addr_new.residence IS '거주여부';
COMMENT ON COLUMN public.addr_new.center_x IS '건물중심점_x좌표';
COMMENT ON COLUMN public.addr_new.center_y IS '건물중심점_y좌표';
COMMENT ON COLUMN public.addr_new.enterance_x IS '출입구_x좌표';
COMMENT ON COLUMN public.addr_new.enterance_y IS '출입구_y좌표';
COMMENT ON COLUMN public.addr_new.ename_sido IS '시도명(영문)';
COMMENT ON COLUMN public.addr_new.ename_sgg IS '시군구명(영문)';
COMMENT ON COLUMN public.addr_new.ename_emd IS '읍면동명(영문)';
COMMENT ON COLUMN public.addr_new.ename_road IS '도로명(영문)';
COMMENT ON COLUMN public.addr_new.is_emd IS '읍면동구분';
COMMENT ON COLUMN public.addr_new.code_mv IS '이동사유코드';

--
-- Type: COMMENT;
--


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

CREATE INDEX sidx_addr_new_geom ON public.addr_new USING gist (geom);

--
-- complete
--
