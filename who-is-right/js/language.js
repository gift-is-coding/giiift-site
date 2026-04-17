// 语言模块
const languageModule = (function() {
    // 当前语言，默认中文
    let currentLang = 'zh';
    
    // 语言文本映射
    const languageData = {
        zh: {
            // 页面标题
            site_title: '谁对谁错',
            site_subtitle: '你们吵架了？让AI天平来裁决吧',
            
            // 天平标签
            male_label: '男方',
            female_label: '女方',
            status_male: '男方暂时占优',
            status_female: '女方暂时占优',
            status_neutral: '双方各有道理',
            
            // 角色切换
            male_speech: '男方发言',
            female_speech: '女方发言',
            
            // 输入区域
            input_male_placeholder: '请输入男方的观点或理由...',
            input_female_placeholder: '请输入女方的观点或理由...',
            submit_btn: '提交发言',
            agree_btn: '签字画押裁决结果',
            ai_thinking: 'AI正在思考...',
            
            // 历史记录
            history_title: '讨论记录',
            ai_evaluation: 'AI评价',
            judgment_reason: '判定理由',
            couple_suggestion: '情侣举措',
            
            // 错误提示
            alert_enter_content: '请输入内容',
            alert_empty_signature: '请先进行签名',
            alert_judgement_failed: '评判失败，请重试',
            alert_need_discussion: '请至少进行一轮讨论',
            confirm_reset: '确定要重置所有记录吗？',
            
            // 操作按钮
            reset_btn: '重置',
            
            // 签名模态框
            signature_title: '签名',
            male_signature: '男方签名',
            female_signature: '女方签名',
            save_btn: '保存签名',
            
            // 结果模态框
            result_title: '裁决结果',
            continue_btn: '继续吵',
            
            // 裁决结果
            male_win: '男方观点更有说服力',
            female_win: '女方观点更有说服力',
            neutral_result: '双方势均力敌，建议和解',
            arguments_record: '争论记录：',
            created_time: '生成时间:',
            save_hint: '长按保存罪证，分享小红书/朋友圈大家伙一起评评理～',
            scan_qr: '扫码访问谁对谁错',
            
            // 语言切换
            lang_switch: 'Switch to English',
            
            // 版权信息
            copyright: '版权所有 © 2025 上海贰人贝武软件有限公司，联系 giiift@163.com'
        },
        en: {
            // Page title
            site_title: 'Who is Right',
            site_subtitle: 'Having an argument? Let AI judge!',
            
            // Balance labels
            male_label: 'Him',
            female_label: 'Her',
            status_male: 'His point leading',
            status_female: 'Her point leading',
            status_neutral: 'Both have valid points',
            
            // Role switch
            male_speech: 'His Point',
            female_speech: 'Her Point',
            
            // Input area
            input_male_placeholder: 'Enter his opinion or reason...',
            input_female_placeholder: 'Enter her opinion or reason...',
            submit_btn: 'Submit',
            agree_btn: 'Sign & Get Verdict',
            ai_thinking: 'AI Thinking...',
            
            // History record
            history_title: 'Discussion History',
            ai_evaluation: 'AI Evaluation',
            judgment_reason: 'Judgment Reason',
            couple_suggestion: 'Couple Suggestion',
            
            // Alerts
            alert_enter_content: 'Please enter content',
            alert_empty_signature: 'Please sign first',
            alert_judgement_failed: 'Judgement failed, please try again',
            alert_need_discussion: 'Please have at least one round of discussion',
            confirm_reset: 'Are you sure you want to reset all records?',
            
            // Action buttons
            reset_btn: 'Reset',
            
            // Signature modal
            signature_title: 'Signature',
            male_signature: 'His Signature',
            female_signature: 'Her Signature',
            save_btn: 'Save Signature',
            
            // Result modal
            result_title: 'Verdict',
            continue_btn: 'Continue Arguing',
            
            // Judgement result
            male_win: 'His argument is more convincing',
            female_win: 'Her argument is more convincing',
            neutral_result: 'Both sides are evenly matched, consider reconciliation',
            arguments_record: 'Argument History:',
            created_time: 'Created:',
            save_hint: 'Press and hold to save & share on social media',
            scan_qr: 'Scan QR code to visit Who is Right',
            
            // Language switch
            lang_switch: '切换到中文',
            
            // Copyright
            copyright: 'Copyright © 2025 Shanghai Erren Beiwu Software Co., Ltd. Contact: giiift@163.com'
        }
    };
    
    // 初始化语言
    function initLanguage() {
        console.log('Initializing language module...');
        // 检查本地存储中是否有语言设置
        const savedLang = localStorage.getItem('preferred_language');
        
        if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
            currentLang = savedLang;
            console.log('Using saved language preference:', currentLang);
        } else {
            // 检测浏览器语言
            detectBrowserLanguage();
        }
        
        // 初始化UI
        updateUI();
        
        console.log('Language initialization complete:', currentLang);
    }
    
    // 检测浏览器语言
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        console.log('Browser language detected:', browserLang);
        
        // 如果浏览器语言以zh开头，设置为中文，否则英文
        if (browserLang.startsWith('zh')) {
            currentLang = 'zh';
        } else {
            currentLang = 'en'; 
        }
        
        // 保存到本地存储
        localStorage.setItem('preferred_language', currentLang);
    }
    
    // 获取指定键的文本
    function getText(key) {
        return languageData[currentLang][key] || key;
    }
    
    // 切换语言
    function switchLanguage() {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        console.log('Language switched to:', currentLang);
        
        // 保存到本地存储
        localStorage.setItem('preferred_language', currentLang);
        
        // 更新UI
        updateUI();
        
        // 触发语言变更事件
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: currentLang } 
        }));
    }
    
    // 获取当前语言
    function getCurrentLanguage() {
        return currentLang;
    }
    
    // 更新UI
    function updateUI() {
        // 更新页面标题
        document.title = getText('site_title');
        
        // 更新网站标题和副标题
        const siteTitle = document.querySelector('.title h1');
        const siteSubtitle = document.querySelector('.title .subtitle');
        if (siteTitle) siteTitle.textContent = getText('site_title');
        if (siteSubtitle) siteSubtitle.textContent = getText('site_subtitle');
        
        // 更新天平标签
        const maleLabel = document.querySelector('.scale-left span:first-child');
        const femaleLabel = document.querySelector('.scale-right span:first-child');
        if (maleLabel) maleLabel.textContent = getText('male_label');
        if (femaleLabel) femaleLabel.textContent = getText('female_label');
        
        // 更新状态文本
        updateStatusText();
        
        // 更新角色标签
        const maleRole = document.querySelector('#boy-role span:nth-child(2)');
        const femaleRole = document.querySelector('#girl-role span:nth-child(2)');
        if (maleRole) maleRole.textContent = getText('male_speech');
        if (femaleRole) femaleRole.textContent = getText('female_speech');
        
        // 更新输入占位符
        const inputField = document.getElementById('argument-input');
        if (inputField) {
            inputField.placeholder = currentRole === 'boy' ? 
                getText('input_male_placeholder') : 
                getText('input_female_placeholder');
        }
        
        // 更新按钮文本
        const submitBtn = document.getElementById('submit-btn');
        const agreeBtn = document.getElementById('agree-btn');
        const resetBtn = document.querySelector('.reset-btn');
        if (submitBtn && !isLoading) submitBtn.textContent = getText('submit_btn');
        if (agreeBtn) agreeBtn.textContent = getText('agree_btn');
        if (resetBtn) resetBtn.textContent = getText('reset_btn');
        
        // 更新历史记录标题
        const historyTitle = document.querySelector('.history-title span');
        if (historyTitle) historyTitle.textContent = getText('history_title');
        
        // 更新模态框标题
        const signatureTitle = document.querySelector('#signature-modal .modal-title');
        const resultTitle = document.querySelector('#result-modal .modal-title');
        if (signatureTitle) signatureTitle.textContent = currentSignatureRole === 'boy' ? 
            getText('male_signature') : getText('female_signature');
        if (resultTitle) resultTitle.textContent = getText('result_title');
        
        // 更新模态框按钮
        const saveBtn = document.getElementById('save-signature');
        const continueBtn = document.querySelector('#result-modal .btn-danger');
        if (saveBtn) saveBtn.textContent = getText('save_btn');
        if (continueBtn) continueBtn.textContent = getText('continue_btn');
        
        // 更新版权信息
        const copyright = document.querySelector('.copyright-text');
        if (copyright) copyright.textContent = getText('copyright');
        
        // 更新语言切换按钮
        updateLanguageSwitchButton();
        
        // 更新历史记录内容
        if (inputHistory.length > 0) {
            updateHistoryUI();
        }
    }
    
    // 更新状态文本
    function updateStatusText() {
        const statusText = document.getElementById('status-text');
        if (!statusText) return;
        
        if (scalePosition < 40) {
            statusText.textContent = getText('status_male');
            statusText.className = 'status-boy';
        } else if (scalePosition > 60) {
            statusText.textContent = getText('status_female');
            statusText.className = 'status-girl';
        } else {
            statusText.textContent = getText('status_neutral');
            statusText.className = 'status-neutral';
        }
    }
    
    // 更新语言切换按钮
    function updateLanguageSwitchButton() {
        let langSwitchBtn = document.getElementById('lang-switch');
        
        // 如果按钮不存在，创建一个
        if (!langSwitchBtn) {
            langSwitchBtn = document.createElement('button');
            langSwitchBtn.id = 'lang-switch';
            langSwitchBtn.className = 'lang-switch-btn';
            langSwitchBtn.onclick = switchLanguage;
            
            // 添加到页面右上角
            const container = document.querySelector('.container');
            if (container) {
                container.appendChild(langSwitchBtn);
            }
        }
        
        // 更新按钮文本
        langSwitchBtn.textContent = getText('lang_switch');
    }
    
    // 更新模态文本
    function updateModalTexts() {
        // 更新签名模态框文本
        const signatureModalTitle = document.getElementById('signature-modal-title');
        if (signatureModalTitle) {
            signatureModalTitle.textContent = currentSignatureRole === 'boy' ? 
                getText('male_signature') : getText('female_signature');
        }
        
        const saveBtn = document.getElementById('save-signature');
        if (saveBtn) saveBtn.textContent = getText('save_btn');
        
        // 更新结果模态框文本
        const resultModalTitle = document.querySelector('#result-modal .modal-title');
        if (resultModalTitle) resultModalTitle.textContent = getText('result_title');
        
        const continueBtn = document.querySelector('#result-modal .btn-danger');
        if (continueBtn) continueBtn.textContent = getText('continue_btn');
    }
    
    // 返回公共方法
    return {
        init: initLanguage,
        getText: getText,
        switchLanguage: switchLanguage,
        getCurrentLanguage: getCurrentLanguage,
        updateUI: updateUI,
        updateStatusText: updateStatusText,
        updateModalTexts: updateModalTexts
    };
})();

// 页面加载完成后初始化语言模块
document.addEventListener('DOMContentLoaded', function() {
    languageModule.init();
}); 