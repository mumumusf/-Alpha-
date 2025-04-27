document.addEventListener('DOMContentLoaded', function() {
    const balanceInput = document.getElementById('balance');
    const tradingVolumeInput = document.getElementById('tradingVolume');
    const calculateButton = document.getElementById('calculate');
    
    const balanceDisplay = document.getElementById('balanceDisplay');
    const volumeDisplay = document.getElementById('volumeDisplay');
    const balancePointsDisplay = document.getElementById('balancePoints');
    const tradingPointsDisplay = document.getElementById('tradingPoints');
    const dailyPointsDisplay = document.getElementById('dailyPoints');
    const totalPointsDisplay = document.getElementById('totalPoints');

    // 计算余额积分
    function calculateBalancePoints(balance) {
        if (balance >= 100000) return 4;
        if (balance >= 10000) return 3;
        if (balance >= 1000) return 2;
        if (balance >= 100) return 1;
        return 0;
    }

    // 计算交易量积分
    function calculateTradingPoints(volume) {
        if (volume < 2) return 0;
        
        // 使用对数计算积分
        // log2(volume/2) + 1 会给出正确的积分
        const points = Math.floor(Math.log2(volume/2)) + 1;
        return Math.max(0, points);
    }

    // 更新显示
    function updateDisplay() {
        const balance = parseFloat(balanceInput.value) || 0;
        const tradingVolume = parseFloat(tradingVolumeInput.value) || 0;

        const balancePoints = calculateBalancePoints(balance);
        const tradingPoints = calculateTradingPoints(tradingVolume);
        const dailyPoints = balancePoints + tradingPoints;
        const totalPoints = dailyPoints * 15; // 15天总积分

        // 格式化数字显示
        balanceDisplay.textContent = balance.toFixed(2);
        volumeDisplay.textContent = tradingVolume.toFixed(2);
        balancePointsDisplay.textContent = balancePoints;
        tradingPointsDisplay.textContent = tradingPoints;
        dailyPointsDisplay.textContent = dailyPoints;
        totalPointsDisplay.textContent = totalPoints;
    }

    // 添加计算按钮事件监听器
    calculateButton.addEventListener('click', updateDisplay);

    // 添加回车键事件监听器
    function handleEnter(event) {
        if (event.key === 'Enter') {
            updateDisplay();
        }
    }

    balanceInput.addEventListener('keypress', handleEnter);
    tradingVolumeInput.addEventListener('keypress', handleEnter);
}); 