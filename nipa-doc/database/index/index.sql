DROP INDEX IF EXISTS public.ecl_pole_tp_code_idx;
DROP INDEX IF EXISTS public.idx_adm_emd_cd;
DROP INDEX IF EXISTS public.idx_adm_emd_kor_nm;
DROP INDEX IF EXISTS public.idx_adm_emd_nk_kor_nm;
DROP INDEX IF EXISTS public.idx_adm_li_cd;
DROP INDEX IF EXISTS public.idx_adm_li_kor_nm;
DROP INDEX IF EXISTS public.idx_adm_sgg_cd;
DROP INDEX IF EXISTS public.idx_adm_sgg_kor_nm;
DROP INDEX IF EXISTS public.idx_adm_sido_cd;
DROP INDEX IF EXISTS public.idx_adm_sido_kor_nm;
DROP INDEX IF EXISTS public.idx_adm_sido_nk_kor_nm;
DROP INDEX IF EXISTS public.idx_sat;
DROP INDEX IF EXISTS public.idx_sk_emd_geom;
DROP INDEX IF EXISTS public.lp_pa_cbnd_pnu_idx;
DROP INDEX IF EXISTS public.place_name_name_ko_idx;
DROP INDEX IF EXISTS public.place_num_fcltylc_nm_idx;
DROP INDEX IF EXISTS public.place_num_spo_no_cd_idx;
DROP INDEX IF EXISTS public.sidx_addr_new_geom;
DROP INDEX IF EXISTS public.sidx_adm_emd_geom;
DROP INDEX IF EXISTS public.sidx_adm_emd_nk_geom;
DROP INDEX IF EXISTS public.sidx_adm_li_geom;
DROP INDEX IF EXISTS public.sidx_adm_sgg_geom;
DROP INDEX IF EXISTS public.sidx_adm_sido_geom;
DROP INDEX IF EXISTS public.sidx_adm_sido_nk_geom;
DROP INDEX IF EXISTS public.sidx_ecl_pole_geom;
DROP INDEX IF EXISTS public.sidx_lp_pa_cbnd_geom;
DROP INDEX IF EXISTS public.sidx_place_name_geom;
DROP INDEX IF EXISTS public.sidx_place_num_geom;
DROP INDEX IF EXISTS public.sidx_sat_bbox_geom;
DROP INDEX IF EXISTS public.sidx_sat_footprint_geom;
DROP INDEX IF EXISTS public.sidx_sk_sdo_geom;
DROP INDEX IF EXISTS public.sidx_sk_sgg_geom;

CREATE INDEX ecl_pole_tp_code_idx ON public.ecl_pole USING btree (tp_code text_pattern_ops);
CREATE INDEX idx_adm_emd_cd ON public.adm_emd USING btree (emd_cd);
CREATE INDEX idx_adm_emd_kor_nm ON public.adm_emd USING btree (emd_kor_nm);
CREATE INDEX idx_adm_emd_nk_kor_nm ON public.adm_emd_nk USING btree (emd_kor_nm);
CREATE INDEX idx_adm_li_cd ON public.adm_li USING btree (li_cd);
CREATE INDEX idx_adm_li_kor_nm ON public.adm_li USING btree (li_kor_nm);
CREATE INDEX idx_adm_sgg_cd ON public.adm_sgg USING btree (sgg_cd);
CREATE INDEX idx_adm_sgg_kor_nm ON public.adm_sgg USING btree (sgg_kor_nm);
CREATE INDEX idx_adm_sido_cd ON public.adm_sido USING btree (sido_cd);
CREATE INDEX idx_adm_sido_kor_nm ON public.adm_sido USING btree (sido_kor_nm);
CREATE INDEX idx_adm_sido_nk_kor_nm ON public.adm_sido_nk USING btree (sido_kor_nm);
CREATE INDEX idx_sat ON public.sat USING btree (acquisition);
CREATE INDEX idx_sk_emd_geom ON public.sk_emd USING gist (geom);
CREATE INDEX lp_pa_cbnd_pnu_idx ON public.lp_pa_cbnd USING btree (pnu text_pattern_ops);
CREATE INDEX place_name_name_ko_idx ON public.place_name USING btree (name_ko text_pattern_ops);
CREATE INDEX place_num_fcltylc_nm_idx ON public.place_num USING btree (fcltylc_nm text_pattern_ops);
CREATE INDEX place_num_spo_no_cd_idx ON public.place_num USING btree (spo_no_cd text_pattern_ops);
CREATE INDEX sidx_addr_new_geom ON public.addr_new USING gist (geom);
CREATE INDEX sidx_adm_emd_geom ON public.adm_emd USING gist (geom);
CREATE INDEX sidx_adm_emd_nk_geom ON public.adm_emd_nk USING gist (geom);
CREATE INDEX sidx_adm_li_geom ON public.adm_li USING gist (geom);
CREATE INDEX sidx_adm_sgg_geom ON public.adm_sgg USING gist (geom);
CREATE INDEX sidx_adm_sido_geom ON public.adm_sido USING gist (geom);
CREATE INDEX sidx_adm_sido_nk_geom ON public.adm_sido_nk USING gist (geom);
CREATE INDEX sidx_ecl_pole_geom ON public.ecl_pole USING gist (geom);
CREATE INDEX sidx_lp_pa_cbnd_geom ON public.lp_pa_cbnd USING gist (geom);
CREATE INDEX sidx_place_name_geom ON public.place_name USING gist (geom);
CREATE INDEX sidx_place_num_geom ON public.place_num USING gist (geom);
CREATE INDEX sidx_sat_bbox_geom ON public.sat USING gist (bbox);
CREATE INDEX sidx_sat_footprint_geom ON public.sat USING gist (footprint);
CREATE INDEX sidx_sk_sdo_geom ON public.sk_sdo USING gist (geom);
CREATE INDEX sidx_sk_sgg_geom ON public.sk_sgg USING gist (geom);