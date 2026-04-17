// 全局变量
let currentRole = 'boy'; // 当前角色，默认为男方
let scalePosition = 50; // 天平位置，0-100，50为中间
let inputHistory = []; // 历史记录
let boySignature = ''; // 男方签名
let girlSignature = ''; // 女方签名
let isLoading = false; // 加载状态
let signaturePad; // 签名画板实例
let currentSignatureRole = ''; // 当前签名的角色

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化签名画板
    const canvas = document.getElementById('signature-pad');
    signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)'
    });

    // 获取"继续吵"按钮
    const continueButton = document.querySelector('#result-modal .modal-footer .btn-danger');
    
    // 将按钮改为链接跳转方式
    if (continueButton) {
        continueButton.removeAttribute('data-bs-dismiss');
        continueButton.addEventListener('click', function() {
            // 直接跳转到主页
            window.location.href = window.location.origin + window.location.pathname;
        });
    }

    // 设置初始状态
    updateScaleUI();
    
    // 监听语言变更事件
    document.addEventListener('languageChanged', function(e) {
        console.log('Language change detected:', e.detail.language);
        updateAllUITexts();
    });
});

// 更新所有UI文本
function updateAllUITexts() {
    // 更新状态
    updateScaleUI();
    
    // 更新输入框提示
    const input = document.getElementById('argument-input');
    if (input) {
        input.placeholder = currentRole === 'boy' ? 
            languageModule.getText('input_male_placeholder') : 
            languageModule.getText('input_female_placeholder');
    }
    
    // 更新提交按钮
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn && !isLoading) {
        submitBtn.textContent = languageModule.getText('submit_btn');
    } else if (submitBtn && isLoading) {
        submitBtn.innerHTML = '<span class="loading-spinner"></span>' + languageModule.getText('ai_thinking');
    }
    
    // 更新历史记录
    updateHistoryUI();
    
    // 更新各种模态框
    updateAllModalTexts();
}

// 更新所有模态框文本
function updateAllModalTexts() {
    // 签名模态框
    const signatureTitle = document.getElementById('signature-modal-title');
    if (signatureTitle) {
        signatureTitle.textContent = currentSignatureRole === 'boy' ? 
            languageModule.getText('male_signature') : 
            languageModule.getText('female_signature');
    }
    
    const saveBtn = document.getElementById('save-signature');
    if (saveBtn) {
        saveBtn.textContent = languageModule.getText('save_btn');
    }
    
    // 结果模态框
    const resultTitle = document.querySelector('#result-modal .modal-title');
    if (resultTitle) {
        resultTitle.textContent = languageModule.getText('result_title');
    }
    
    const continueBtn = document.querySelector('#result-modal .btn-danger');
    if (continueBtn) {
        continueBtn.textContent = languageModule.getText('continue_btn');
    }
}

// 切换角色
function switchRole(role) {
    if (role === currentRole) return;
    
    currentRole = role;
    
    // 更新UI
    const boyRole = document.getElementById('boy-role');
    const girlRole = document.getElementById('girl-role');
    const input = document.getElementById('argument-input');
    
    if (role === 'boy') {
        boyRole.classList.add('active-boy');
        girlRole.classList.remove('active-girl');
        input.placeholder = languageModule.getText('input_male_placeholder');
    } else {
        boyRole.classList.remove('active-boy');
        girlRole.classList.add('active-girl');
        input.placeholder = languageModule.getText('input_female_placeholder');
    }
}

// 提交输入
function submitInput() {
    const input = document.getElementById('argument-input');
    const content = input.value.trim();
    
    if (!content) {
        alert(languageModule.getText('alert_enter_content'));
        return;
    }
    
    if (isLoading) return;
    
    // 设置加载状态
    isLoading = true;
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerHTML = '<span class="loading-spinner"></span>' + languageModule.getText('ai_thinking');
    submitBtn.disabled = true;
    
    // 添加到历史记录
    const newEntry = {
        role: currentRole,
        content: content,
        time: new Date().toLocaleString(),
        type: 'user' // 标记为用户输入
    };
    inputHistory.push(newEntry);
    
    // 显示历史记录
    updateHistoryUI();
    
    // 调用AI评判
    callAIJudgement(inputHistory, currentRole, content)
        .then(aiResponse => {
            // 更新UI
            scalePosition = aiResponse.score;
            updateScaleUI();
            
            // 显示AI评价
            const aiCommentContainer = document.getElementById('ai-comment-container');
            const aiComment = document.getElementById('ai-comment');
            aiComment.textContent = aiResponse.comment;
            aiCommentContainer.style.display = 'block';
            
            // 添加AI回复到历史记录
            const aiEntry = {
                role: 'ai',
                content: aiResponse.comment,
                time: new Date().toLocaleString(),
                type: 'ai', // 标记为AI回复
                score: aiResponse.score, // 保存评分
                reason: aiResponse.reason, // 保存判定理由
                suggestion: aiResponse.suggestion // 保存举措建议
            };
            inputHistory.push(aiEntry);
            
            // 更新历史记录UI
            updateHistoryUI();
            
            // 自动切换到另一方
            switchRole(currentRole === 'boy' ? 'girl' : 'boy');
            
            // 清空输入框
            input.value = '';
            
            // 重置加载状态
            isLoading = false;
            submitBtn.innerHTML = languageModule.getText('submit_btn');
            submitBtn.disabled = false;
        })
        .catch(error => {
            console.error('AI评判失败:', error);
            alert(languageModule.getText('alert_judgement_failed'));
            
            // 重置加载状态
            isLoading = false;
            submitBtn.innerHTML = languageModule.getText('submit_btn');
            submitBtn.disabled = false;
        });
}

// 调用AI判断
async function callAIJudgement(history, currentRole, currentInput) {
    // 获取当前语言
    const currentLang = languageModule.getCurrentLanguage();
    
    // 构建提示词
    let prompt = currentLang === 'zh' ?
        "你是一个公正的裁判，评判男女双方在争论中谁更有道理。请分析以下对话内容，给出谁更有道理的评分、简短评价、判定理由和改善建议。\n\n历史对话：\n" :
        "You are a fair judge, determining who has the more valid argument between a couple, answer in English. Please analyze the following conversation and provide a score, brief comment, reasoning, and improvement suggestions.\n\nConversation history:\n";
    
    history.forEach((item, index) => {
        if (index === history.length - 1) {
            // 最新的输入
            if (currentLang === 'zh') {
                prompt += `${item.role === 'boy' ? '男方' : '女方'}(最新发言): ${item.content}\n`;
            } else {
                prompt += `${item.role === 'boy' ? 'Him' : 'Her'} (latest): ${item.content}\n`;
            }
        } else {
            if (currentLang === 'zh') {
                prompt += `${item.role === 'boy' ? '男方' : '女方'}: ${item.content}\n`;
            } else {
                prompt += `${item.role === 'boy' ? 'Him' : 'Her'}: ${item.content}\n`;
            }
        }
    });
    
    if (currentLang === 'zh') {
        prompt += "\n请给出0-100之间的分数，0表示完全支持男方，100表示完全支持女方，50表示中立。";
        prompt += "同时给出简短的一句话评价，风格搞笑毒舌讽刺(不超过30字)。";
        prompt += "另外，请提供一段判定理由(不超过60字)，分析为何一方更有道理。";
        prompt += "最后，提供一条实际可行的举措建议(不超过60字)，帮助情侣改善关系，解决争议。";
        prompt += "返回格式为JSON: {\"score\": 分数, \"comment\": \"评价\", \"reason\": \"判定理由\", \"suggestion\": \"举措建议\"}";
    } else {
        prompt += "\nPlease provide a score between 0-100, where 0 means completely supporting him, 100 means completely supporting her, and 50 is neutral.";
        prompt += "Also provide a brief witty, sarcastic one-sentence comment (no more than 30 characters).";
        prompt += "Additionally, provide a reasoning (no more than 60 characters) for your judgment.";
        prompt += "Finally, suggest one practical action (no more than 60 characters) to help the couple improve their relationship.";
        prompt += "Return in JSON format: {\"score\": score, \"comment\": \"comment\", \"reason\": \"reasoning\", \"suggestion\": \"suggestion\"}";
    }
    
    try {
        // 调用后端API
        const response = await fetch('/api/dashscope-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'qwen-max',
                prompt: prompt,
                parameters: {
                    result_format: 'text',
                    temperature: 0.5,
                    max_tokens: 1024
                }
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || (currentLang === 'zh' ? '请求失败' : 'Request failed'));
        }
        
        // 解析返回结果
        let responseText = '';
        if (data.data && data.data.output && data.data.output.text) {
            responseText = data.data.output.text;
        }
        
        // 从响应文本中提取JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        let aiResponse = null;
        
        if (jsonMatch) {
            try {
                aiResponse = JSON.parse(jsonMatch[0]);
            } catch (e) {
                console.error('JSON解析失败:', e);
            }
        }
        
        // 如果解析失败或缺少必要字段，使用默认值
        if (!aiResponse || typeof aiResponse.score !== 'number') {
            aiResponse = {
                score: 50,
                comment: currentLang === 'zh' ? 
                    "无法解析AI响应，使用默认中立评价。" : 
                    "Could not parse AI response, using default neutral evaluation.",
                reason: currentLang === 'zh' ?
                    "双方各有观点，但无法得出明确结论。" :
                    "Both sides have valid points, but no clear conclusion can be drawn.",
                suggestion: currentLang === 'zh' ?
                    "建议双方心平气和地坐下来，认真倾听对方的想法。" :
                    "Suggest both parties sit down calmly and listen to each other's thoughts."
            };
        }
        
        // 确保分数在0-100之间
        aiResponse.score = Math.max(0, Math.min(100, aiResponse.score));
        
        return aiResponse;
    } catch (error) {
        console.error('调用AI评判失败:', error);
        throw error;
    }
}

// 更新天平UI
function updateScaleUI() {
    // 更新天平旋转
    const scaleBeam = document.getElementById('scale-beam');
    scaleBeam.style.transform = `rotate(${(scalePosition-50)/2}deg)`;
    
    // 更新分数显示
    const maleScore = document.getElementById('male-score');
    const femaleScore = document.getElementById('female-score');
    maleScore.textContent = `${Math.round(100 - scalePosition)}%`;
    femaleScore.textContent = `${Math.round(scalePosition)}%`;
    
    // 更新状态文本
    const statusText = document.getElementById('status-text');
    
    if (scalePosition < 40) {
        statusText.textContent = languageModule.getText('status_male');
        statusText.className = 'status-boy';
    } else if (scalePosition > 60) {
        statusText.textContent = languageModule.getText('status_female');
        statusText.className = 'status-girl';
    } else {
        statusText.textContent = languageModule.getText('status_neutral');
        statusText.className = 'status-neutral';
    }
}

// 更新历史记录UI
function updateHistoryUI() {
    const historyContainer = document.getElementById('history-container');
    const historyList = document.getElementById('history-list');
    
    // 如果有历史记录，显示容器
    if (inputHistory.length > 0) {
        historyContainer.style.display = 'block';
    }
    
    // 清空历史列表
    historyList.innerHTML = '';
    
    // 添加历史记录
    inputHistory.forEach(item => {
        if (item.type === 'ai') {
            // AI评价的历史记录样式
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item ai-item';
            
            const historyRole = document.createElement('div');
            historyRole.className = 'history-role';
            historyRole.innerHTML = `
                <span class="history-role-icon">🤖</span>
                <span>${languageModule.getText('ai_evaluation')}</span>
            `;
            
            const historyContent = document.createElement('div');
            historyContent.className = 'history-content';
            historyContent.textContent = item.content;
            
            // 添加判定理由（如果存在）
            if (item.reason) {
                const historyReason = document.createElement('div');
                historyReason.className = 'history-reason';
                historyReason.innerHTML = `<strong>${languageModule.getText('judgment_reason')}：</strong> ${item.reason}`;
                historyItem.appendChild(historyRole);
                historyItem.appendChild(historyContent);
                historyItem.appendChild(historyReason);
            } else {
                historyItem.appendChild(historyRole);
                historyItem.appendChild(historyContent);
            }
            
            // 添加举措建议（如果存在）
            if (item.suggestion) {
                const historySuggestion = document.createElement('div');
                historySuggestion.className = 'history-suggestion';
                historySuggestion.innerHTML = `<strong>${languageModule.getText('couple_suggestion')}：</strong> ${item.suggestion}`;
                historyItem.appendChild(historySuggestion);
            }
            
            const historyScore = document.createElement('div');
            historyScore.className = 'history-score';
            if (item.score < 40) {
                historyScore.className += ' score-boy';
                historyScore.textContent = `${languageModule.getText('status_male')} ${Math.round(100 - item.score)}%`;
            } else if (item.score > 60) {
                historyScore.className += ' score-girl';
                historyScore.textContent = `${languageModule.getText('status_female')} ${Math.round(item.score)}%`;
            } else {
                historyScore.className += ' score-neutral';
                historyScore.textContent = `${languageModule.getText('status_neutral')} ${Math.round(100 - item.score)}% : ${Math.round(item.score)}%`;
            }
            
            const historyTime = document.createElement('div');
            historyTime.className = 'history-time';
            historyTime.textContent = item.time;
            
            historyItem.appendChild(historyScore);
            historyItem.appendChild(historyTime);
            
            historyList.appendChild(historyItem);
        } else {
            // 用户发言的历史记录样式
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${item.role === 'boy' ? 'boy-item' : 'girl-item'}`;
            
            const historyRole = document.createElement('div');
            historyRole.className = 'history-role';
            historyRole.innerHTML = `
                <span class="history-role-icon">${item.role === 'boy' ? '👨' : '👩'}</span>
                <span>${item.role === 'boy' ? languageModule.getText('male_label') : languageModule.getText('female_label')}</span>
            `;
            
            const historyContent = document.createElement('div');
            historyContent.className = 'history-content';
            historyContent.textContent = item.content;
            
            const historyTime = document.createElement('div');
            historyTime.className = 'history-time';
            historyTime.textContent = item.time;
            
            historyItem.appendChild(historyRole);
            historyItem.appendChild(historyContent);
            historyItem.appendChild(historyTime);
            
            historyList.appendChild(historyItem);
        }
    });
    
    // 滚动到底部
    historyList.scrollTop = historyList.scrollHeight;
}

// 重置天平
function resetScale() {
    if (confirm(languageModule.getText('confirm_reset'))) {
        scalePosition = 50;
        inputHistory = [];
        boySignature = '';
        girlSignature = '';
        
        // 更新UI
        updateScaleUI();
        
        // 隐藏历史记录
        const historyContainer = document.getElementById('history-container');
        historyContainer.style.display = 'none';
        
        // 隐藏AI评价
        const aiCommentContainer = document.getElementById('ai-comment-container');
        aiCommentContainer.style.display = 'none';
        
        // 清空输入框
        document.getElementById('argument-input').value = '';
        
        // 重置到男方
        switchRole('boy');
    }
}

// 同意裁决结果 - 保持签名流程
function agreeToResult() {
    if (inputHistory.length === 0) {
        alert(languageModule.getText('alert_need_discussion'));
        return;
    }
    
    // 显示签名模态框
    currentSignatureRole = 'boy';
    showSignatureModal('boy');
}

// 显示签名模态框
function showSignatureModal(role) {
    currentSignatureRole = role;
    const modalTitle = document.getElementById('signature-modal-title');
    modalTitle.textContent = role === 'boy' ? languageModule.getText('male_signature') : languageModule.getText('female_signature');
    
    // 清空画板
    signaturePad.clear();
    
    // 移除之前可能存在的事件监听器
    const saveButton = document.getElementById('save-signature');
    const newSaveButton = saveButton.cloneNode(true);
    saveButton.parentNode.replaceChild(newSaveButton, saveButton);
    
    // 添加事件监听器
    if (role === 'girl' && boySignature) {
        // 女方签名，准备后续生成结果
        newSaveButton.addEventListener('click', function() {
            if (signaturePad.isEmpty()) {
                alert(languageModule.getText('alert_empty_signature'));
                return;
            }
            
            // 保存女方签名
            girlSignature = signaturePad.toDataURL();
            
            // 关闭模态框
            const modal = bootstrap.Modal.getInstance(document.getElementById('signature-modal'));
            modal.hide();
            
            // 生成结果
            setTimeout(() => {
                if (boySignature && girlSignature) {
                    generateResultImage();
                }
            }, 300);
        });
    } else if (role === 'boy') {
        // 男方签名，然后显示女方签名框
        newSaveButton.addEventListener('click', function() {
            if (signaturePad.isEmpty()) {
                alert(languageModule.getText('alert_empty_signature'));
                return;
            }
            
            // 保存男方签名
            boySignature = signaturePad.toDataURL();
            
            // 关闭模态框
            const modal = bootstrap.Modal.getInstance(document.getElementById('signature-modal'));
            modal.hide();
            
            // 显示女方签名框
            setTimeout(() => {
                showSignatureModal('girl');
            }, 300);
        });
    }
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('signature-modal'));
    modal.show();
}

// 生成结果图片 - 替代原来的 saveResult 函数
function generateResultImage() {
    if (!boySignature || !girlSignature || inputHistory.length === 0) {
        return;
    }
    
    try {
        // 计算最终结果
        let finalScore = scalePosition;
        let winner = finalScore < 40 ? 'male' : (finalScore > 60 ? 'female' : 'neutral');
        let message = '';
        
        if (winner === 'male') {
            message = languageModule.getText('male_win');
        } else if (winner === 'female') {
            message = languageModule.getText('female_win');
        } else {
            message = languageModule.getText('neutral_result');
        }
        
        // 查找最后一条AI评价，获取判定理由和建议
        let reason = '';
        let suggestion = '';
        for (let i = inputHistory.length - 1; i >= 0; i--) {
            if (inputHistory[i].type === 'ai') {
                reason = inputHistory[i].reason || '';
                suggestion = inputHistory[i].suggestion || '';
                break;
            }
        }
        
        // 构建结果数据
        const resultData = {
            winner,
            message,
            reason,
            suggestion,
            maleWeight: 100 - finalScore,
            femaleWeight: finalScore,
            arguments: inputHistory.map(item => ({
                side: item.role === 'boy' ? 'male' : (item.role === 'girl' ? 'female' : 'ai'),
                content: item.content,
                time: item.time,
                type: item.type || 'user',
                score: item.score
            })),
            signatures: {
                boy: boySignature,
                girl: girlSignature
            }
        };
        
        // 绘制结果画布
        drawResultCanvas(resultData);
        
        // 显示结果模态框
        const modal = new bootstrap.Modal(document.getElementById('result-modal'));
        modal.show();
    } catch (error) {
        console.error('生成结果失败:', error);
        alert(languageModule.getText('alert_judgement_failed'));
    }
}

// 通用文本换行函数 - 支持比例缩放
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text || text.length === 0) return y;
    
    const words = text.split('');
    let line = '';
    let currentY = y;
    
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i];
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, x, currentY);
            line = words[i];
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    
    // 绘制最后一行
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
}

// 绘制结果画布 - 优化版本
function drawResultCanvas(result) {
    const canvas = document.getElementById('result-canvas');
    const ctx = canvas.getContext('2d');
    
    // 获取设备屏幕宽度，用于自适应
    const screenWidth = window.innerWidth;
    
    // 根据设备宽度调整画布宽度
    // 在桌面端使用更高的分辨率，移动端使用适中的分辨率以提高性能
    const canvasWidth = screenWidth < 768 ? 900 : 1800; 
    
    // 预先计算所需的画布高度
    let estimatedHeight = calculateCanvasHeight(ctx, result, canvasWidth);
    
    // 设置画布尺寸
    canvas.width = canvasWidth;
    canvas.height = estimatedHeight;
    
    // 清空画布
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 计算文本和图形的比例因子，使桌面版和移动版有一致的视觉效果
    const scaleFactor = canvasWidth / 1800;
    
    // 标题 - 根据比例缩放字体
    ctx.fillStyle = '#333';
    const titleFontSize = Math.round(72 * scaleFactor);
    ctx.font = `bold ${titleFontSize}px Arial`;
    ctx.textAlign = 'left';
    const titleX = Math.round(60 * scaleFactor);
    const titleY = Math.round(120 * scaleFactor);
    
    // 裁决结果标题只显示一次
    ctx.fillText(languageModule.getText('result_title'), titleX, titleY);
    
    // 结果文本 - 移动到标题下方
    ctx.fillStyle = '#333';
    const msgFontSize = Math.round(54 * scaleFactor);
    ctx.font = `bold ${msgFontSize}px Arial`;
    const msgY = Math.round(210 * scaleFactor);
    ctx.fillText(result.message, titleX, msgY);
    
    // 添加判定理由（如果存在）
    if (result.reason) {
        const reasonFontSize = Math.round(42 * scaleFactor);
        ctx.font = `${reasonFontSize}px Arial`;
        const reasonY = Math.round(290 * scaleFactor);
        ctx.fillText(languageModule.getText('judgment_reason') + '：' + result.reason, titleX, reasonY);
    }
    
    // 添加情侣举措建议（如果存在）
    if (result.suggestion) {
        const suggestionFontSize = Math.round(42 * scaleFactor);
        ctx.font = `${suggestionFontSize}px Arial`;
        const suggestionY = Math.round(370 * scaleFactor);
        ctx.fillText(languageModule.getText('couple_suggestion') + '：' + result.suggestion, titleX, suggestionY);
    }
    
    // 绘制天平 - 向下移动一点
    const scaleY = Math.round(480 * scaleFactor);
    drawScale(ctx, canvas.width / 2, scaleY, result.maleWeight, result.femaleWeight, scaleFactor);
    
    // 争论内容 - 调整位置
    ctx.textAlign = 'left';
    const recordFontSize = Math.round(48 * scaleFactor);
    ctx.font = `${recordFontSize}px Arial`;
    const recordY = Math.round(930 * scaleFactor);
    ctx.fillText(languageModule.getText('arguments_record'), titleX, recordY);
    
    // 起始Y坐标，根据比例缩放
    let y = Math.round(1020 * scaleFactor);
    
    // 行高和间距，根据比例缩放
    const lineHeight = Math.round(75 * scaleFactor);
    const aiGap = Math.round(105 * scaleFactor);
    const userGap = Math.round(45 * scaleFactor);
    
    // 遍历所有参数，包括AI评价
    result.arguments.forEach((arg, index) => {
        if (arg.type === 'ai') {
            // AI评价样式
            ctx.fillStyle = '#6a0dad'; // 紫色
            const prefix = '🤖 ' + languageModule.getText('ai_evaluation') + ': ';
            const text = prefix + arg.content;
            
            // 使用通用文本换行函数
            const maxWidth = canvas.width - (120 * scaleFactor);
            y = wrapText(ctx, text, titleX, y, maxWidth, lineHeight);
            
            // 添加评分信息
            if (arg.score !== undefined) {
                const scoreLabelX = Math.round(120 * scaleFactor);
                if (arg.score < 40) {
                    ctx.fillStyle = '#4a4af4'; // 蓝色，男方
                    ctx.fillText(`${languageModule.getText('male_label')} ${Math.round(100 - arg.score)}%`, scoreLabelX, y);
                } else if (arg.score > 60) {
                    ctx.fillStyle = '#f44a6c'; // 粉色，女方
                    ctx.fillText(`${languageModule.getText('female_label')} ${Math.round(arg.score)}%`, scoreLabelX, y);
                } else {
                    ctx.fillStyle = '#666'; // 灰色，中立
                    ctx.fillText(`${Math.round(100 - arg.score)}% : ${Math.round(arg.score)}%`, scoreLabelX, y);
                }
            }
            
            y += aiGap; // 从AI评价到下一个评论的间隔
        } else {
            // 用户发言样式
            ctx.fillStyle = arg.side === 'male' ? '#333' : '#333';
            const prefix = arg.side === 'male' ? 
                          '👨 ' + languageModule.getText('male_label') + ': ' : 
                          '👩 ' + languageModule.getText('female_label') + ': ';
            const text = prefix + arg.content;
            
            // 使用通用文本换行函数
            const maxWidth = canvas.width - (120 * scaleFactor);
            y = wrapText(ctx, text, titleX, y, maxWidth, lineHeight);
            y += userGap; // 额外的行间距
        }
    });
    
    // 签名
    ctx.fillStyle = '#333';
    ctx.font = `${recordFontSize}px Arial`;
    const signatureYOffset = Math.round(60 * scaleFactor);
    ctx.fillText(languageModule.getText('male_signature') + ':', titleX, y + signatureYOffset);
    
    // 绘制男方签名
    const signatureWidth = Math.round(450 * scaleFactor);
    const signatureHeight = Math.round(180 * scaleFactor);
    const boySignatureImg = new Image();
    
    boySignatureImg.onload = function() {
        const boySignatureY = Math.round(90 * scaleFactor);
        ctx.drawImage(boySignatureImg, titleX, y + boySignatureY, signatureWidth, signatureHeight);
        
        // 绘制女方签名 - 位置向左移动
        const girlLabelY = Math.round(300 * scaleFactor);
        ctx.fillText(languageModule.getText('female_signature') + ':', titleX, y + girlLabelY);
        
        const girlSignatureImg = new Image();
        girlSignatureImg.onload = function() {
            const girlSignatureY = Math.round(330 * scaleFactor);
            ctx.drawImage(girlSignatureImg, titleX, y + girlSignatureY, signatureWidth, signatureHeight);
            
            // 时间戳 - 相应下移
            ctx.textAlign = 'left';
            const timestampFontSize = Math.round(42 * scaleFactor);
            ctx.font = `${timestampFontSize}px Arial`;
            ctx.fillStyle = '#333';
            const timestampY = Math.round(540 * scaleFactor);
            ctx.fillText(languageModule.getText('created_time') + ' ' + new Date().toLocaleString(), titleX, y + timestampY);
            
            // 添加文字阴影
            const shadowOffset = Math.round(3 * scaleFactor);
            const shadowBlur = Math.round(9 * scaleFactor);
            
            // 保存提示使用普通字体，无阴影
            const hintY = Math.round(615 * scaleFactor);
            // 设置保存提示的字体样式（普通字体，非斜体）
            const hintFontSize = Math.round(42 * scaleFactor);
            ctx.font = `${hintFontSize}px Arial`;
            ctx.fillStyle = '#555';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillText(languageModule.getText('save_hint'), titleX, y + hintY);
            
            // 重新启用阴影效果用于后续元素
            ctx.shadowColor = 'rgba(125, 92, 245, 0.3)';
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffset;
            ctx.shadowOffsetY = shadowOffset;
            
            // 加载并绘制二维码
            const qrCodeImg = new Image();
            qrCodeImg.onload = function() {
                // 二维码尺寸和位置
                const qrSize = Math.round(240 * scaleFactor);
                const qrMargin = Math.round(60 * scaleFactor);
                const qrY = Math.min(y + Math.round(660 * scaleFactor), canvas.height - qrSize - qrMargin);
                
                // 绘制二维码
                ctx.drawImage(qrCodeImg, canvas.width - qrSize - qrMargin, qrY, qrSize, qrSize);
                
                // 添加说明文字，位置与二维码保持一致
                ctx.textAlign = 'right';
                const qrDescFontSize = Math.round(36 * scaleFactor);
                ctx.font = `${qrDescFontSize}px Arial`;
                ctx.fillStyle = '#666';
                ctx.fillText(languageModule.getText('scan_qr'), canvas.width - qrMargin, qrY + qrSize + Math.round(30 * scaleFactor));
                
                // 将Canvas转换为可保存图片
                setTimeout(function() {
                    // 获取Canvas的数据URL，确保使用高质量输出
                    const imgDataUrl = canvas.toDataURL('image/png', 1.0);
                    
                    // 创建图片元素
                    const resultImg = document.createElement('img');
                    resultImg.src = imgDataUrl;
                    resultImg.alt = languageModule.getText('result_title');
                    resultImg.className = 'result-image';
                    
                    // 获取容器并替换内容
                    const container = document.querySelector('.result-canvas-container');
                    container.innerHTML = '';
                    container.appendChild(resultImg);
                    
                }, 200); // 短暂延迟确保绘制完成
            };
            qrCodeImg.src = 'images/qrCode.png';
        };
        girlSignatureImg.src = result.signatures.girl;
    };
    boySignatureImg.src = result.signatures.boy;
}

// 计算画布所需高度
function calculateCanvasHeight(ctx, result, canvasWidth) {
    // 获取比例因子 
    const scaleFactor = canvasWidth / 1800;
    
    // 基础高度(头部+天平+底部元素的固定高度)
    let baseHeight = Math.round(900 * scaleFactor);
    let textHeight = 0;
    
    // 设置字体以便计算文本高度
    const fontSize = Math.round(48 * scaleFactor);
    ctx.font = `${fontSize}px Arial`;
    const maxWidth = canvasWidth - Math.round(120 * scaleFactor);
    const lineHeight = Math.round(75 * scaleFactor);
    
    // 计算所有参数文本所需的高度
    result.arguments.forEach(arg => {
        const prefix = arg.type === 'ai' ? 
                       '🤖 ' + languageModule.getText('ai_evaluation') + ': ' : 
                       (arg.side === 'male' ? 
                        '👨 ' + languageModule.getText('male_label') + ': ' : 
                        '👩 ' + languageModule.getText('female_label') + ': ');
        const text = prefix + arg.content;
        
        // 计算这段文本需要的行数
        let textLines = 1;
        let words = text.split('');
        let line = '';
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i];
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                textLines++;
                line = words[i];
            } else {
                line = testLine;
            }
        }
        
        // 每行高度与行间距
        textHeight += textLines * lineHeight;
        if (arg.type === 'ai') {
            textHeight += Math.round(105 * scaleFactor); // AI评价额外间距
        } else {
            textHeight += Math.round(45 * scaleFactor); // 用户发言额外间距
        }
    });
    
    // 签名部分的额外高度
    const signatureHeight = Math.round(750 * scaleFactor);
    
    // 总高度 = 基础高度 + 文本高度 + 签名高度
    return Math.max(Math.round(2400 * scaleFactor), baseHeight + textHeight + signatureHeight);
}

// 修改绘制天平函数，添加比例因子支持
function drawScale(ctx, centerX, centerY, maleWeight, femaleWeight, scaleFactor) {
    const beamLength = Math.round(600 * scaleFactor);
    // 增加角度计算系数，使倾斜更明显
    const angle = ((femaleWeight - maleWeight) / 20) * Math.PI / 180 * 5;
    
    // 天平支架
    ctx.fillStyle = '#7d5cf5';
    const supportWidth = Math.round(24 * scaleFactor);
    const supportHeight = Math.round(300 * scaleFactor);
    ctx.fillRect(centerX - supportWidth/2, centerY, supportWidth, supportHeight);
    
    const baseWidth = Math.round(300 * scaleFactor);
    const baseHeight = Math.round(30 * scaleFactor);
    ctx.fillRect(centerX - baseWidth/2, centerY + supportHeight, baseWidth, baseHeight);
    
    // 天平横梁
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    ctx.fillStyle = '#7d5cf5';
    const beamHeight = Math.round(30 * scaleFactor);
    ctx.fillRect(-beamLength / 2, -beamHeight/2, beamLength, beamHeight);
    
    // 天平左右盘
    const panRadius = Math.round(90 * scaleFactor);
    const lineWidth = Math.round(6 * scaleFactor);
    
    // 左盘（男方）
    ctx.fillStyle = 'rgba(74, 74, 244, 0.2)';
    ctx.beginPath();
    ctx.arc(-beamLength / 2, 0, panRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4a4af4';
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    // 右盘（女方）
    ctx.fillStyle = 'rgba(244, 74, 108, 0.2)';
    ctx.beginPath();
    ctx.arc(beamLength / 2, 0, panRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f44a6c';
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    ctx.restore();
    
    // 左右标签文字
    const labelFontSize = Math.round(48 * scaleFactor);
    const labelOffset = Math.round(120 * scaleFactor);
    ctx.font = `bold ${labelFontSize}px Arial`;
    ctx.textAlign = 'center';
    
    // 男方标签
    ctx.fillStyle = '#4a4af4';
    ctx.fillText(languageModule.getText('male_label'), centerX - beamLength / 2, centerY - labelOffset);
    
    // 女方标签
    ctx.fillStyle = '#f44a6c';
    ctx.fillText(languageModule.getText('female_label'), centerX + beamLength / 2, centerY - labelOffset);
    
    // 百分比显示
    ctx.fillStyle = '#333';
    ctx.fillText(Math.round(maleWeight) + '%', centerX - beamLength / 2, centerY + labelOffset);
    ctx.fillText(Math.round(femaleWeight) + '%', centerX + beamLength / 2, centerY + labelOffset);
} 