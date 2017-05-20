/**   
 * Copyright © 2016 Arvato. All rights reserved.
 * 
 * @Title: MyFilter.java 
 * @Prject: mdm-web
 * @Package: com.mdm.aop 
 * @Description: TODO
 * @author: gaod003   
 * @date: 2016年10月12日 下午11:41:23 
 * @version: V1.0   
 */
package com.einwin.mdm.page.filter;

import com.einwin.mdm.main.client.UserClient;
import com.einwin.mdm.main.client.bean.pojo.UserBasicsInfo;
import com.einwin.mdm.main.client.response.CommonResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import java.io.IOException;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@Component("myFilter")
public class MyFilter implements Filter {

    @Autowired
    private UserClient userClient;

    @Override
    public void destroy() {

    }
    /**
     * @throws IOException
     * @throws ServletException
     * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest, javax.servlet.ServletResponse, javax.servlet.FilterChain)
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)  throws IOException,
            ServletException {

    	HttpServletRequest httpRequest =(HttpServletRequest) request;;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        //如果Session 中已经存在User 了， 不做验证
        if(null!=httpRequest.getSession().getAttribute("user")){
            chain.doFilter(request, response);
            return;
        }
        //此部分要放到WEB中
        if(null==httpRequest.getSession().getAttribute("user")&&
                !StringUtils.isEmpty(httpRequest.getRemoteUser())){
           CommonResponse<UserBasicsInfo> commonResponse =userClient.findUserBymobile(httpRequest.getRemoteUser());
            if(null!=commonResponse&&commonResponse.getResCode()==200&&commonResponse.getData()!=null){
                //2017-01-05 企业代码非CCPG无法登录MDM
                if(!"CCPG".equalsIgnoreCase(commonResponse.getData().getCorpCode())){
                   // LoginController loginController = MyApplicationContextUtil.getBean(LoginController.class);
                    response.setContentType("text/html; charset=utf-8");
                    response.setCharacterEncoding("utf-8");
                    response.getWriter().print("<script>alert('非长城物业用户无法登录主数据平台！');window.location.href='"+"http://mdmuat.einwin.com/sso/" +"logout?service="+"http://localhost:18766/" +"web/test.html" +";'</script>");
                    return;
                }
                else{
                    // 超级管理员不拦截
                  /*  CommonResponse<Boolean> commonResponseisAdmin= userClient.isAdmin();
                   if (null!=commonResponseisAdmin&&commonResponseisAdmin.getData()) {
                        httpRequest.getSession().setAttribute("user", commonResponse.getData());
                        chain.doFilter(request, response);
                        return;
                    }*/
                    // 检查是否有权限
                    /*if (!checkPermission(request, commonResponse.getData().getId())) {
                        response.setContentType("application/json");
                        response.setCharacterEncoding("utf-8");
                        response.getWriter().print("对不起，你没有权限");
                        return;
                    }*/
                    httpRequest.getSession().setAttribute("user", commonResponse.getData());
                }
            }
        }
    	chain.doFilter(httpRequest, httpResponse);
    }

    /**
     * @param arg0
     * @throws ServletException
     * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
     */  
    @Override  
    public void init(FilterConfig arg0) throws ServletException {
    }
       
}
