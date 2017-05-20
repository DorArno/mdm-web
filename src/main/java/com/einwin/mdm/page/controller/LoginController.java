package com.einwin.mdm.page.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

/**
 * Created by GONG009 on 2017/4/11.
 */
@RestController
@RequestMapping("login")
public class LoginController {

    @Value("${ssoServerUrl}")
    private String ssoServerUrl;

    @Value("${localServerUrl}")
    private String localServerUrl;

    @Value("${server.context-path}")
    private String contextUrl;

    @RequestMapping("home")
    public String home(){
       // oAuth2RestTemplate.getForEntity("http://eureka.einwin.com:9999/uaa/user", Principal.class);
        return "hello word!!";
    }
    @RequestMapping("redirect")
    public ModelAndView redirect(HttpSession httpSession){
        if(httpSession.getAttribute("user")==null){
            String returnUrl = ssoServerUrl +"login?service="+localServerUrl +"mdm/test.html";
            return new ModelAndView(new RedirectView(returnUrl));
        }
        return new ModelAndView(new RedirectView(contextUrl+"/"));
    }

    @RequestMapping(value="loginOut",method=RequestMethod.POST)
    public Object loginCheck(HttpSession httpSession){
        if(httpSession.getAttribute("user")!=null){
            httpSession.removeAttribute("user");
        }
        httpSession.invalidate();
        String returnUrl = "logout?service="+localServerUrl +"web/test.html";
        return this.createJson(true,200,"",returnUrl);
    }


    public static Map<String, Object> createJson(boolean isOk, int resCode, String errorMsg, Object obj) {
        Map<String, Object> jsonMap = new HashMap<String,Object>();
        jsonMap.put("result", isOk ? "true" : "false");
        jsonMap.put("resCode", resCode);
        jsonMap.put("resMsg", errorMsg);
        jsonMap.put("data", obj);
        return jsonMap;
    }

}
