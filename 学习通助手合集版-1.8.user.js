// ==UserScript==
// @name         学习通助手合集版
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  题目导出 + 自动答题（选择/判断/简答），弹窗可最小化，支持AI提示词
// @match        *://*.chaoxing.com/*
// @match        *://*.xuexi360.com/*
// @match        *://mooc1.chaoxing.com/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 样式 ====================
    GM_addStyle(`
        /* 弹窗容器 */
        #cxAnswerModal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 999999;
            overflow: hidden;
            resize: both;
            min-width: 300px;
            min-height: 200px;
            max-width: 90vw;
            max-height: 90vh;
        }
        #cxAnswerModal.minimized {
            width: 200px !important;
            height: 50px !important;
            min-width: 200px;
            min-height: 50px;
            resize: none;
            overflow: hidden;
        }
        #cxAnswerModal.minimized .cx-modal-body,
        #cxAnswerModal.minimized .cx-modal-footer { display: none; }

        .cx-modal-header {
            padding: 15px 20px;
            background: rgba(0,0,0,0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        }
        .cx-modal-title { font-size: 16px; font-weight: 600; }
        .cx-header-buttons { display: flex; gap: 8px; }
        .cx-header-btn {
            width: 30px; height: 30px; border: none; border-radius: 4px;
            background: rgba(255,255,255,0.1); color: white; cursor: pointer;
            font-size: 16px; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s;
        }
        .cx-header-btn:hover { background: rgba(255,255,255,0.2); }
        .cx-minimize-btn { font-size: 20px; }
        .cx-close-btn { background: rgba(255,0,0,0.3); }
        .cx-close-btn:hover { background: rgba(255,0,0,0.5); }

        .cx-modal-body { padding: 20px; }
        .cx-input-group { margin-bottom: 16px; }
        .cx-input-group label {
            display: block; margin-bottom: 8px; font-size: 14px;
            color: rgba(255,255,255,0.9);
        }
        .cx-textarea {
            width: 100%; height: 100px; padding: 12px 15px; border: none;
            border-radius: 8px; background: rgba(255,255,255,0.1); color: white;
            font-size: 14px; resize: vertical; outline: none; box-sizing: border-box;
        }
        .cx-textarea:focus { background: rgba(255,255,255,0.15); }
        .cx-format-tip {
            background: rgba(255,255,255,0.05); padding: 10px 14px;
            border-radius: 8px; font-size: 12px; color: rgba(255,255,255,0.8); line-height: 1.5;
        }
        .cx-btn-group { display: flex; gap: 10px; margin-top: 16px; }
        .cx-btn {
            flex: 1; padding: 11px 0; border: none; border-radius: 8px;
            cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;
        }
        .cx-export-btn { background: #22c55e; color: white; }
        .cx-export-btn:hover { background: #16a34a; }
        .cx-start-btn { background: #00c853; color: white; }
        .cx-start-btn:hover { background: #00e676; }
        .cx-test-btn { background: rgba(255,255,255,0.1); color: white; }
        .cx-test-btn:hover { background: rgba(255,255,255,0.15); }
        .cx-warning {
            background: rgba(255,0,0,0.1); padding: 10px 15px; border-radius: 8px;
            font-size: 13px; color: #ff5252; margin-top: 12px;
            display: flex; align-items: center; gap: 8px;
        }

        .cx-modal-footer {
            padding: 12px 20px; border-top: 1px solid rgba(255,255,255,0.1);
            font-size: 12px; color: rgba(255,255,255,0.6); text-align: center;
        }

        /* 导出结果弹窗 */
        #cxExportModal {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 9999999; width: 80%; max-width: 900px; max-height: 80vh;
            background: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            padding: 20px; overflow-y: auto; color: #333;
        }
        #cxExportModal h3 { margin: 0 0 15px 0; }
        #cxExportModal textarea {
            width: 100%; height: 60vh; padding: 12px; border: 1px solid #e5e7eb;
            border-radius: 8px; font-size: 14px; line-height: 1.6; resize: none;
            box-sizing: border-box;
        }
        #cxExportMask {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.5); z-index: 9999998;
        }
        .cx-export-wrap { margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end; }
        .cx-export-action {
            padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; color: white;
        }
        .cx-copy-btn { background: #2563eb; }
        .cx-copy-btn:hover { background: #1d4ed8; }
        .cx-close-export { background: #6b7280; }
        .cx-close-export:hover { background: #4b5563; }

        .cx-fill-btn { background: #ff9800; color: white; }
        .cx-fill-btn:hover { background: #f57c00; }

        /* 进度条 */
        .cx-progress-wrap {
            margin-top: 12px; display: none;
        }
        .cx-progress-text {
            font-size: 12px; color: rgba(255,255,255,0.8); margin-bottom: 6px;
            display: flex; justify-content: space-between;
        }
        .cx-progress-bar {
            width: 100%; height: 8px; background: rgba(255,255,255,0.15);
            border-radius: 4px; overflow: hidden;
        }
        .cx-progress-fill {
            height: 100%; width: 0%; background: #00e676;
            border-radius: 4px; transition: width 0.3s;
        }
    `);

    // ==================== 工具函数 ====================
    function makeDraggable(header, element) {
        let isDragging = false, currentX = 0, currentY = 0, initialX = 0, initialY = 0;
        header.addEventListener('mousedown', dragStart);
        function dragStart(e) {
            e.preventDefault();
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
            isDragging = true;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        }
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            currentX = Math.max(0, Math.min(e.clientX - initialX, window.innerWidth - element.offsetWidth));
            currentY = Math.max(0, Math.min(e.clientY - initialY, window.innerHeight - element.offsetHeight));
            element.style.left = currentX + 'px';
            element.style.top = currentY + 'px';
            element.style.transform = 'none';
        }
        function dragEnd() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
        }
    }

    // 统一解析：支持 "题号.答案" 格式 和 空格分隔格式
    // 返回 { choice: [{idx, ans}], short: [{idx, text}] }
    function parseAllAnswers(input, totalQuestions) {
        const lines = input.trim().split('\n').filter(l => l.trim());
        const choice = [], shortAns = [];
        let lastIdx = -1;

        // 检测是否有任何 "题号.答案" 格式
        const hasNumberedFormat = lines.some(l => /^\d+[.、．]\s*\S/.test(l.trim()));

        if (hasNumberedFormat) {
            // 有题号格式：逐行解析，多行合并到同一题
            lines.forEach(line => {
                line = line.trim();
                if (!line) return;
                const m = line.match(/^(\d+)[.、．]\s*(.*)/);
                if (m) {
                    const idx = parseInt(m[1]) - 1;
                    const ansText = m[2].trim();
                    if (idx < 0 || idx >= totalQuestions) return;
                    lastIdx = idx;
                    if (/^[A-Za-z]{1,10}$/.test(ansText) || /^对$|^错$/.test(ansText)) {
                        choice.push({ idx, ans: ansText.toUpperCase() });
                    } else {
                        shortAns.push({ idx, text: ansText });
                    }
                } else if (lastIdx >= 0) {
                    // 没有题号的续行，合并到上一题（简答题多行）
                    const lastShort = shortAns.find(s => s.idx === lastIdx);
                    if (lastShort) {
                        lastShort.text += '\n' + line;
                    }
                }
            });
        } else {
            // 无题号格式：空格分隔（兼容旧版）
            const tokens = input.trim().split(/\s+/).filter(s => s.trim());
            let idx = 0;
            tokens.forEach(token => {
                if (idx >= totalQuestions) return;
                const ans = token.toUpperCase();
                if (/^[A-Z]{1,10}$/.test(ans) || /^对$|^错$/.test(ans)) {
                    choice.push({ idx, ans });
                } else {
                    shortAns.push({ idx, text: token });
                }
                idx++;
            });
        }

        return { choice, short: shortAns };
    }

    // ==================== 题目导出 ====================
    function getCleanText(el) {
        const clone = el.cloneNode(true);
        clone.querySelectorAll('script, style, .edui-editor, .edui-container, textarea[id^="answer"]').forEach(e => e.remove());
        return clone.textContent.trim().replace(/\s+/g, ' ');
    }

    function exportQuestions() {
        let questionEls = document.querySelectorAll('.questionLi');
        if (questionEls.length === 0) {
            alert('未找到题目，请在作业/考试页面使用');
            return;
        }

        let allQuestions = [], num = 1;

        questionEls.forEach(qEl => {
            let questionText = getCleanText(qEl);
            questionText = questionText
                .replace(/^\d+[.、．]\s*/, '')
                .replace(/（(单选题|多选题|判断题)）/g, '')
                .replace(/^(单选题|多选题|判断题)\s*/g, '')
                .trim();

            if (!questionText) { num++; return; }

            const optionEls = qEl.querySelectorAll('.answerLi, .option-item, .subLabel div, .answerBox li');
            const options = [];
            optionEls.forEach(opt => {
                const text = opt.textContent.trim().replace(/\s+/g, ' ');
                if (text && text.length < 200) options.push(text);
            });

            const rawText = qEl.textContent;
            const isJudge = rawText.includes('判断题') || (options.length === 2 && options.every(o => /对|错/.test(o)));
            const isShort = options.length === 0 && !isJudge;
            const type = isShort ? '简答' : (isJudge ? '判断' : '选择');

            allQuestions.push({ num, text: questionText, options, type });
            num++;
        });

        if (allQuestions.length === 0) {
            alert('未提取到有效题目内容');
            return;
        }

        // 构建提示词
        let prompt = `以下是题目，请直接返回答案，每行一题，严格按格式：题号.答案\n`;
        prompt += `格式要求：\n`;
        prompt += `- 单选题：题号.字母（如 1.A）\n`;
        prompt += `- 多选题：题号.字母组合（如 21.BCD）\n`;
        prompt += `- 判断题：题号.对 或 题号.错（如 26.对）\n`;
        prompt += `- 简答题：题号.答案内容（如 41.全面深化改革的总目标是...）\n`;
        prompt += `---\n`;

        allQuestions.forEach(q => {
            const tag = q.type === '简答' ? '（简答）' : (q.type === '判断' ? '（判断）' : '');
            prompt += `${q.num}. ${q.text} ${tag}\n`;
            q.options.forEach(o => { prompt += `   ${o}\n`; });
            prompt += '\n';
        });

        prompt += `---\n请按格式返回全部答案：`;

        // 弹窗展示
        const mask = document.createElement('div');
        mask.id = 'cxExportMask';
        mask.onclick = () => { mask.remove(); modal.remove(); };

        const modal = document.createElement('div');
        modal.id = 'cxExportModal';
        modal.innerHTML = `
            <h3>📋 题目导出（含AI提示词）</h3>
            <p style="color:#666;font-size:13px;margin:0 0 10px;">复制下方内容发给AI，AI返回答案后直接粘贴到答题弹窗中自动填入</p>
            <textarea readonly>${prompt}</textarea>
            <div class="cx-export-wrap">
                <button class="cx-export-action cx-copy-btn">📋 一键复制全部</button>
                <button class="cx-export-action cx-close-export">关闭</button>
            </div>
        `;

        const textarea = modal.querySelector('textarea');
        modal.querySelector('.cx-copy-btn').onclick = () => {
            textarea.select();
            document.execCommand('copy');
            const btn = modal.querySelector('.cx-copy-btn');
            btn.textContent = '✅ 复制成功！';
            setTimeout(() => { btn.textContent = '📋 一键复制全部'; }, 1500);
        };
        modal.querySelector('.cx-close-export').onclick = () => { mask.remove(); modal.remove(); };

        document.body.appendChild(mask);
        document.body.appendChild(modal);
        textarea.focus();
    }

    // ==================== 获取题目选项（兼容多种选择器）====================
    function getQuestionOptions(questionEl) {
        let opts = questionEl.querySelectorAll('li[data]');
        if (opts.length > 0) return opts;
        opts = questionEl.querySelectorAll('.answerLi');
        if (opts.length > 0) return opts;
        opts = questionEl.querySelectorAll('.option-item');
        if (opts.length > 0) return opts;
        opts = questionEl.querySelectorAll('[class*="option"]');
        if (opts.length > 0) return opts;
        opts = questionEl.querySelectorAll('ul li, ol li');
        if (opts.length > 0) return opts;
        return [];
    }

    // ==================== 自动答题（选择/判断）+ 进度条 ====================
    function startAnswering(questions, answerMap, modal) {
        document.querySelectorAll('[aria-hidden="true"][tabindex="-1"]').forEach(el => {
            el.removeAttribute('tabindex');
            el.removeAttribute('aria-hidden');
        });

        const progressWrap = modal.querySelector('.cx-progress-wrap');
        const progressFill = modal.querySelector('.cx-progress-fill');
        const progressText = modal.querySelector('.cx-progress-text');
        if (progressWrap) progressWrap.style.display = 'block';

        const total = answerMap.length;
        let done = 0;

        answerMap.forEach(({ idx, ans }, i) => {
            if (idx >= questions.length) { done++; return; }
            setTimeout(() => {
                const options = getQuestionOptions(questions[idx]);
                if (options.length === 0) {
                    console.log(`第${idx+1}题：未找到选项`);
                } else {
                    // 判断题特殊处理：只有2个选项且答案是"对"或"错"，直接按位置点击
                    if (options.length === 2 && (ans === '对' || ans === '错')) {
                        const clickIdx = ans === '对' ? 0 : 1;
                        options[clickIdx].click();
                        console.log(`第${idx+1}题：判断题 → 点击第${clickIdx+1}个选项（${ans}）`);
                    } else {
                        // 选择题：按字母匹配
                        ans.split('').forEach(a => {
                            const target = Array.from(options).find(opt => {
                                const t = opt.textContent.trim();
                                if (/^[A-Z]$/i.test(a)) return t.toUpperCase().startsWith(a);
                                return t.includes(a);
                            });
                            if (target) {
                                target.click();
                                console.log(`第${idx+1}题：选择 ${a}（匹配: ${target.textContent.trim().substring(0,20)}）`);
                            } else {
                                console.log(`第${idx+1}题：未找到选项 ${a}，可选项: ${Array.from(options).map(o=>o.textContent.trim().substring(0,10)).join(', ')}`);
                            }
                        });
                    }
                }
                done++;
                if (progressFill) progressFill.style.width = Math.round(done / total * 100) + '%';
                if (progressText) progressText.innerHTML = `<span>正在填入... ${done}/${total}</span><span>${Math.round(done/total*100)}%</span>`;

                // 全部完成
                if (done === total) {
                    setTimeout(() => {
                        if (progressText) progressText.innerHTML = `<span>✅ 全部完成</span><span>100%</span>`;
                        if (progressFill) progressFill.style.background = '#00e676';
                        alert(`选择/判断题填入完成！共处理 ${total} 道`);
                    }, 500);
                }
            }, i * 450 + Math.random() * 150);
        });
    }

    // ==================== 填入简答题 ====================
    function fillShortAnswers(answerMap, questions, modal) {
        if (typeof UE === 'undefined' || !UE.instants) {
            alert('UEditor 未加载，请确保页面已完全打开');
            return;
        }
        // 数值排序：防止 ueditorInstant10 排在 ueditorInstant2 前面
        const editorKeys = Object.keys(UE.instants).sort((a, b) => {
            const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
            const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
            return numA - numB;
        });
        if (editorKeys.length === 0) {
            alert('未找到简答题编辑器');
            return;
        }

        // 找出所有简答题在 questions 数组中的索引
        const shortQIndices = [];
        questions.forEach((q, i) => {
            if (getQuestionOptions(q).length === 0) {
                shortQIndices.push(i);
            }
        });

        const progressWrap = modal.querySelector('.cx-progress-wrap');
        const progressFill = modal.querySelector('.cx-progress-fill');
        const progressText = modal.querySelector('.cx-progress-text');
        if (progressWrap) progressWrap.style.display = 'block';

        let filled = 0;
        const total = answerMap.length;
        answerMap.forEach(({ idx, text }, i) => {
            const shortPos = shortQIndices.indexOf(idx);
            if (shortPos === -1) {
                console.log(`第${idx+1}题不是简答题，跳过`);
                filled++; // 仍然计入进度
                return;
            }
            const editor = UE.instants[editorKeys[shortPos]];
            if (editor) {
                editor.setContent('<p>' + text.replace(/\n/g, '</p><p>') + '</p>');
                filled++;
                console.log(`简答第${idx+1}题（${editorKeys[shortPos]}）：已填入`);
            }

            if (progressFill) progressFill.style.width = Math.round((i + 1) / total * 100) + '%';
            if (progressText) progressText.innerHTML = `<span>简答题填入中... ${i+1}/${total}</span><span>${Math.round((i+1)/total*100)}%</span>`;
        });

        if (progressText) progressText.innerHTML = `<span>✅ 简答题全部完成</span><span>100%</span>`;
        alert(`简答题填入完成！共填入 ${filled} 道`);
    }

    // ==================== 答题弹窗 ====================
    function createAnswerModal(questions) {
        const existing = document.getElementById('cxAnswerModal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'cxAnswerModal';
        modal.innerHTML = `
            <div class="cx-modal-header">
                <div class="cx-modal-title">学习通助手</div>
                <div class="cx-header-buttons">
                    <button class="cx-header-btn cx-minimize-btn" title="最小化">−</button>
                    <button class="cx-header-btn cx-close-btn" title="关闭">×</button>
                </div>
            </div>
            <div class="cx-modal-body">
                <div class="cx-input-group">
                    <label>粘贴AI返回的答案：</label>
                    <textarea class="cx-textarea" style="height:150px;" placeholder="直接粘贴AI返回的答案，例如：&#10;1.A&#10;2.C&#10;26.对&#10;41.全面深化改革的总目标是..."></textarea>
                </div>
                <div class="cx-format-tip">
                    <strong>支持的格式：</strong><br>
                    • 单选：1.A &nbsp; 多选：21.BCD &nbsp; 判断：26.对<br>
                    • 简答：41.答案内容（多行同题自动合并）<br>
                    • 每行一题，题号.答案，脚本自动识别题型并填入
                </div>
                <div class="cx-btn-group">
                    <button class="cx-btn cx-export-btn">📋 导出题目</button>
                    <button class="cx-btn cx-start-btn">🚀 一键填入全部</button>
                    <button class="cx-btn cx-test-btn">🔍 测试答案</button>
                </div>
                <div class="cx-warning" id="cxWarningMsg" style="display:none;"></div>
                <div class="cx-progress-wrap">
                    <div class="cx-progress-text"><span>准备中...</span><span>0%</span></div>
                    <div class="cx-progress-bar"><div class="cx-progress-fill"></div></div>
                </div>
            </div>
            <div class="cx-modal-footer">
                支持单选/多选/判断/简答 | 一键导出题目+AI提示词 | 一键填入答案
            </div>
        `;

        document.body.appendChild(modal);
        makeDraggable(modal.querySelector('.cx-modal-header'), modal);

        const minimizeBtn = modal.querySelector('.cx-minimize-btn');
        const closeBtn = modal.querySelector('.cx-close-btn');
        const textarea = modal.querySelector('.cx-textarea');

        minimizeBtn.onclick = () => {
            const minimized = modal.classList.toggle('minimized');
            minimizeBtn.textContent = minimized ? '□' : '−';
            minimizeBtn.title = minimized ? '最大化' : '最小化';
        };
        closeBtn.onclick = () => modal.remove();

        // 导出按钮
        modal.querySelector('.cx-export-btn').onclick = exportQuestions;

        // 测试按钮
        modal.querySelector('.cx-test-btn').onclick = () => {
            const result = parseAllAnswers(textarea.value, questions.length);
            let msg = `识别结果：\n`;
            msg += `选择/判断题：${result.choice.length} 道\n`;
            result.choice.forEach(c => { msg += `  第${c.idx+1}题 → ${c.ans}\n`; });
            msg += `简答题：${result.short.length} 道\n`;
            result.short.forEach(s => { msg += `  第${s.idx+1}题 → ${s.text.substring(0,30)}...\n`; });
            alert(msg);
        };

        // 一键填入全部
        modal.querySelector('.cx-start-btn').onclick = () => {
            const result = parseAllAnswers(textarea.value, questions.length);
            if (result.choice.length === 0 && result.short.length === 0) {
                alert('请先粘贴AI返回的答案！');
                return;
            }

            const warning = modal.querySelector('#cxWarningMsg');
            const totalFilled = result.choice.length + result.short.length;
            if (totalFilled < questions.length) {
                warning.textContent = `⚠️ 共${questions.length}题，已填入${totalFilled}题，${questions.length - totalFilled}题将跳过`;
                warning.style.display = 'flex';
            } else {
                warning.style.display = 'none';
            }

            modal.style.display = 'none';

            // 填入选择/判断题
            if (result.choice.length > 0) {
                startAnswering(questions, result.choice, modal);
            }

            // 填入简答题
            if (result.short.length > 0) {
                fillShortAnswers(result.short, questions, modal);
            }

            setTimeout(() => { if (modal.parentNode) modal.remove(); }, 1000);
        };

        textarea.focus();
    }

    // ==================== 初始化 ====================
    window.addEventListener('load', () => {
        let waitForQuestions = setInterval(() => {
            const questions = document.querySelectorAll('.questionLi');
            if (questions.length > 0) {
                clearInterval(waitForQuestions);
                setTimeout(() => createAnswerModal(questions), 500);
            }
        }, 500);
    });
})();
