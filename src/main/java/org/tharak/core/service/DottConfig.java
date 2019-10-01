package org.tharak.core.service;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.tharak.core.util.DataSourceMgr;

@Configuration
public class DottConfig implements WebMvcConfigurer{
	@Bean
	public DataSourceMgr getDataSourceMgr(DataSource ds) {
		
		DataSourceMgr mgr = DataSourceMgr.getMgr();
		mgr.setDataSource(ds);
		return mgr;
	}
	/*
	 * @Override public void addInterceptors(InterceptorRegistry registry) {
	 * registry.addInterceptor(new SecurityIntercepter()); }
	 */
	
}
