/**
 * 猫咪动画控制类
 * 处理猫咪精灵图动画和球的动画
 */
class CatAnimation {
    /**
     * 初始化猫咪动画
     * @param {HTMLElement} catSprite - 猫咪精灵图容器元素
     * @param {HTMLElement} catFrame - 猫咪精灵图元素
     */
    constructor(catSprite, catFrame) {
        this.catSprite = catSprite;
        this.catFrame = catFrame;
        this.ball = document.getElementById('throw-ball');
        
        // 动画状态
        this.isPlaying = false;
        this.currentFrame = 0; // 0: 第一帧(下), 1: 第二帧(上)
        this.framePositions = ['0 -533px', '0 0']; // 帧位置: [下帧, 上帧]
        this.animationTimers = []; // 存储所有定时器
    }
    
    /**
     * 清除所有计时器和动画
     */
    clearAllTimers() {
        // 清除所有定时器
        this.animationTimers.forEach(timer => clearTimeout(timer));
        this.animationTimers = [];
    }
    
    /**
     * 重置动画到初始状态
     */
    resetAnimation() {
        this.clearAllTimers();
        this.isPlaying = false;
        this.currentFrame = 0;
        this.catFrame.style.objectPosition = this.framePositions[0]; // 设置为第一帧(下)
        
        // 隐藏球
        if (this.ball) {
            this.ball.style.display = 'none';
            this.ball.style.transform = 'rotate(0deg)'; // 重置旋转
        }
    }
    
    /**
     * 播放猫咪动画
     * @param {number} speed - 动画速度，单位为秒
     * @param {Function} onComplete - 动画完成时的回调函数
     * @param {HTMLElement} targetElement - 球的目标元素，不提供则不投球
     */
    playAnimation(speed, onComplete, targetElement) {
        // 确保猫咪可见
        this.catSprite.classList.remove('hidden');
        
        // 重置动画状态
        this.resetAnimation();
        
        // 计算每一帧的持续时间
        const frameDuration = (speed * 1000) / 3; // 分三个阶段：初始帧 -> 第二帧 -> 回到初始帧
        
        // 标记动画正在播放
        this.isPlaying = true;
        
        // 第一阶段：初始帧(显示下半部分)
        this.catFrame.style.objectPosition = this.framePositions[0];
        
        // 第二阶段：切换到第二帧(显示上半部分)
        const timer1 = setTimeout(() => {
            if (!this.isPlaying) return;
            this.currentFrame = 1;
            this.catFrame.style.objectPosition = this.framePositions[1];
            
            // 如果有目标元素，执行投球动画
            if (targetElement && this.ball) {
                // 投球动画有自己的回调，我们不在这里直接调用onComplete
                this.throwBallToTarget(targetElement, onComplete);
                return; // 让投球动画负责调用完成回调
            }
            
        }, frameDuration);
        this.animationTimers.push(timer1);
        
        // 如果没有投球，那么第三阶段后调用完成回调
        if (!targetElement || !this.ball) {
            // 第三阶段：切回初始帧(显示下半部分)
            const timer2 = setTimeout(() => {
                if (!this.isPlaying) return;
                this.currentFrame = 0;
                this.catFrame.style.objectPosition = this.framePositions[0];
                
                // 动画结束
                this.isPlaying = false;
                
                // 动画完成后回调
                if (typeof onComplete === 'function') {
                    setTimeout(onComplete, 100);
                }
            }, frameDuration * 2);
            this.animationTimers.push(timer2);
        }
    }
    
    /**
     * 计算猫咪手部位置
     * @returns {Object} 包含x和y坐标
     */
    getCatHandPosition() {
        const catRect = this.catSprite.getBoundingClientRect();
        // 猫的手部位置位于猫的右上部分
        const handPos = {
            x: catRect.left + catRect.width * 0.6,
            y: catRect.top + catRect.height * 0.4
        };
        return handPos;
    }
    
    /**
     * 扔球到目标元素
     * @param {HTMLElement} targetElement - 目标元素
     * @param {Function} onCompleteCallback - 动画完成时的回调函数
     */
    throwBallToTarget(targetElement, onCompleteCallback) {
        if (!this.ball || !targetElement) {
            if (typeof onCompleteCallback === 'function') {
                onCompleteCallback(); // 如果没有球或目标，直接调用回调
            }
            return;
        }
        
        // 获取猫手部位置和目标元素位置
        const handPos = this.getCatHandPosition();
        const targetRect = targetElement.getBoundingClientRect();
        const targetPos = {
            x: targetRect.left + targetRect.width / 2,
            y: targetRect.top + targetRect.height / 2
        };
        
        // 初始化球的位置到猫的手部
        this.ball.style.left = `${handPos.x}px`;
        this.ball.style.top = `${handPos.y}px`;
        this.ball.style.display = 'block';
        
        // 计算距离和时间 - 加快球的速度
        const distance = Math.sqrt(
            Math.pow(targetPos.x - handPos.x, 2) + 
            Math.pow(targetPos.y - handPos.y, 2)
        );
        const duration = Math.min(0.4 + distance / 2000, 0.8); // 进一步缩短球的飞行时间
        
        // 添加抛物线动画
        const startTime = performance.now();
        const midHeight = Math.min(60, distance * 0.2); // 降低抛物线高度，提高速度感
        const midPoint = {
            x: (handPos.x + targetPos.x) / 2,
            y: handPos.y - midHeight // 抛物线最高点
        };
        
        // 使用requestAnimationFrame实现平滑动画
        const animate = (time) => {
            const elapsed = (time - startTime) / 1000; // 转为秒
            const progress = Math.min(elapsed / duration, 1);
            
            if (progress < 1) {
                // 二次贝塞尔曲线模拟抛物线
                const x = this.quadraticBezier(handPos.x, midPoint.x, targetPos.x, progress);
                const y = this.quadraticBezier(handPos.y, midPoint.y, targetPos.y, progress);
                
                // 更新球的位置
                this.ball.style.left = `${x}px`;
                this.ball.style.top = `${y}px`;
                
                // 添加更快的旋转效果
                const rotation = progress * 1080; // 三圈旋转
                this.ball.style.transform = `rotate(${rotation}deg)`;
                
                // 继续动画
                requestAnimationFrame(animate);
            } else {
                // 动画结束，确保球到达目标位置
                this.ball.style.left = `${targetPos.x}px`;
                this.ball.style.top = `${targetPos.y}px`;
                
                // 触发目标元素的动画效果，并在完成后回调
                this.animateTargetElement(targetElement, () => {
                    // 隐藏球
                    this.ball.style.display = 'none';
                    
                    // 切回初始帧
                    this.currentFrame = 0;
                    this.catFrame.style.objectPosition = this.framePositions[0];
                    
                    // 动画结束
                    this.isPlaying = false;
                    
                    // 在所有动画完成后调用回调
                    if (typeof onCompleteCallback === 'function') {
                        onCompleteCallback();
                    }
                });
            }
        };
        
        // 开始动画
        requestAnimationFrame(animate);
    }
    
    /**
     * 计算二次贝塞尔曲线的点
     */
    quadraticBezier(p0, p1, p2, t) {
        return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    }
    
    /**
     * 触发目标元素的动画效果
     * @param {HTMLElement} targetElement - 目标元素
     * @param {Function} onAnimationComplete - 按钮动画完成后的回调
     */
    animateTargetElement(targetElement, onAnimationComplete) {
        // 保存原始尺寸
        const originalTransform = targetElement.style.transform;
        
        // 设置更快的过渡
        targetElement.style.transition = 'transform 0.15s ease-out';
        targetElement.style.transform = 'scale(1.15)';
        
        // 恢复原始尺寸
        setTimeout(() => {
            targetElement.style.transform = originalTransform || 'scale(1)';
            
            // 移除过渡，避免影响其他动画
            setTimeout(() => {
                targetElement.style.transition = '';
                
                // 按钮动画完成后立即调用回调
                if (typeof onAnimationComplete === 'function') {
                    onAnimationComplete();
                }
            }, 150);
        }, 80);
    }
}

// 导出类以便可以在其他文件中使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CatAnimation;
} 