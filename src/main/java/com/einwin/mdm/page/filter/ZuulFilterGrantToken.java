package com.einwin.mdm.page.filter;

import com.einwin.mdm.main.client.bean.pojo.UserBasicsInfo;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * Created by GONG009 on 2017/4/14.
 */
public class ZuulFilterGrantToken extends ZuulFilter{

    private static Logger logger = LoggerFactory.getLogger(ZuulFilterGrantToken.class);

    private static final int RESCODE_FAIL = 201;

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 1;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }


    @Override
    public Object run(){
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();
        UserBasicsInfo user =(UserBasicsInfo)request.getSession().getAttribute("user");
        if(null!=user){
            ctx.addZuulRequestHeader("operatorId",user.getId());
        }
        return null;
    }
}
