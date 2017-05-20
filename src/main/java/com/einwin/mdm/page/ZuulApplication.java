package com.einwin.mdm.page;

import com.einwin.mdm.page.filter.MyFilter;
import com.einwin.mdm.page.filter.ZuulFilterGrantToken;
import com.netflix.zuul.ZuulFilter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;

import javax.annotation.Resource;
import javax.servlet.Filter;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.einwin.mdm.main.client")
@EnableZuulProxy
@EnableOAuth2Sso
@ComponentScan(basePackages = "com.einwin.mdm.page")
public class ZuulApplication extends WebSecurityConfigurerAdapter {

    private static final Logger LOG = LoggerFactory.getLogger(ZuulApplication.class);

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.logout().logoutUrl("/logout").and()
                .addFilterBefore(authLogoutFilter(), LogoutFilter.class)
                .authorizeRequests()
                .antMatchers("/index.html", "/login/loginOut", "/home.html", "/login", "/logout").permitAll()
                .anyRequest().authenticated();
    }

    public FilterRegistrationBean filterRegistrationBean(MyFilter myFilter) {
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
        filterRegistrationBean.setFilter(myFilter);
        filterRegistrationBean.setEnabled(true);
        filterRegistrationBean.setOrder(1);
        filterRegistrationBean.addUrlPatterns("/*");
        return filterRegistrationBean;
    }
  /*@LoadBalanced
    @Primary
    @Bean
    public OAuth2RestTemplate loadBalancedOauth2RestTemplate(
            OAuth2ProtectedResourceDetails resource, OAuth2ClientContext context) {
        return new OAuth2RestTemplate(resource, context);
    }*/

    public static void main(String[] args) {
        int buildNo = 15;
        //LOG.info("Edge-server, starting build no. {}...", buildNo);
        new SpringApplicationBuilder(ZuulApplication.class).run(args);
        //LOG.info("Edge-server, build nMyFiltero. {} started", buildNo);
    }


    @Bean
    public ZuulFilter zuulFilterGrantToken() {
        return new ZuulFilterGrantToken();
    }

    @Bean
    public LogoutFilter authLogoutFilter() {
        LogoutFilter logoutFilter = new LogoutFilter("http://10.11.21.9:9999/uaa/logout", new SecurityContextLogoutHandler());
        logoutFilter.setFilterProcessesUrl("/logout");
        return logoutFilter;
    }

}