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

    // 积分提升计算器元素
    const currentPointsInput = document.getElementById('currentPoints');
    const targetPointsInput = document.getElementById('targetPoints');
    const calculateUpgradeButton = document.getElementById('calculateUpgrade');
    const balanceUpgradeResult = document.getElementById('balanceUpgradeResult');
    const volumeUpgradeResult = document.getElementById('volumeUpgradeResult');
    const combinedUpgradeResult = document.getElementById('combinedUpgradeResult');

    // 资金分配计算器元素
    const availableFundsInput = document.getElementById('availableFunds');
    const calculateAllocationButton = document.getElementById('calculateAllocation');
    const optimalAllocationResult = document.getElementById('optimalAllocationResult');
    const pointsAnalysisResult = document.getElementById('pointsAnalysisResult');

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

    // 积分提升计算器功能
    function calculateUpgradeOptions() {
        const currentPoints = parseInt(currentPointsInput.value) || 0;
        const targetPoints = parseInt(targetPointsInput.value) || 0;
        
        if (currentPoints >= targetPoints) {
            balanceUpgradeResult.textContent = "目标积分必须大于当前积分";
            volumeUpgradeResult.textContent = "目标积分必须大于当前积分";
            combinedUpgradeResult.textContent = "目标积分必须大于当前积分";
            return;
        }
        
        const pointsNeeded = targetPoints - currentPoints;
        const dailyPointsNeeded = Math.ceil(pointsNeeded / 15);
        
        // 方案一：增加余额
        let balanceOption = calculateBalanceUpgradeOption(dailyPointsNeeded);
        balanceUpgradeResult.innerHTML = balanceOption;
        
        // 方案二：增加交易量
        let volumeOption = calculateVolumeUpgradeOption(dailyPointsNeeded);
        volumeUpgradeResult.innerHTML = volumeOption;
        
        // 方案三：同时增加余额和交易量
        let combinedOption = calculateCombinedUpgradeOption(dailyPointsNeeded);
        combinedUpgradeResult.innerHTML = combinedOption;
    }
    
    // 计算增加余额的方案
    function calculateBalanceUpgradeOption(dailyPointsNeeded) {
        let currentBalancePoints = 0;
        let targetBalancePoints = dailyPointsNeeded;
        
        // 找到当前余额对应的积分
        for (let balance = 0; balance <= 100000; balance += 1000) {
            if (calculateBalancePoints(balance) === currentBalancePoints) {
                continue;
            }
            if (calculateBalancePoints(balance) > currentBalancePoints) {
                currentBalancePoints = calculateBalancePoints(balance);
                if (currentBalancePoints >= targetBalancePoints) {
                    return `将余额增加到 <strong>${balance.toLocaleString()}</strong> 美元，可获得 <strong>${currentBalancePoints}</strong> 积分/天<br>
                            <span class="detail">• 需要增加: ${(balance - 0).toLocaleString()} 美元</span><br>
                            <span class="detail">• 15天总积分: ${currentBalancePoints * 15}</span>`;
                }
            }
        }
        
        return `无法仅通过增加余额达到目标积分`;
    }
    
    // 计算增加交易量的方案
    function calculateVolumeUpgradeOption(dailyPointsNeeded) {
        // 使用对数反函数计算所需交易量
        // 如果 log2(volume/2) + 1 = points，则 volume = 2^(points-1) * 2
        const requiredVolume = Math.pow(2, dailyPointsNeeded - 1) * 2;
        
        return `将每日交易量增加到 <strong>${requiredVolume.toLocaleString()}</strong> 美元，可获得 <strong>${dailyPointsNeeded}</strong> 积分/天<br>
                <span class="detail">• 需要增加: ${(requiredVolume - 0).toLocaleString()} 美元/天</span><br>
                <span class="detail">• 15天总积分: ${dailyPointsNeeded * 15}</span>`;
    }
    
    // 计算同时增加余额和交易量的方案
    function calculateCombinedUpgradeOption(dailyPointsNeeded) {
        // 生成所有可能的余额和交易量组合
        const options = [];
        
        // 尝试不同的余额和交易量组合
        for (let balancePoints = 0; balancePoints <= dailyPointsNeeded; balancePoints++) {
            const volumePoints = dailyPointsNeeded - balancePoints;
            
            // 找到对应的余额
            let requiredBalance = 0;
            for (let balance = 0; balance <= 100000; balance += 1000) {
                if (calculateBalancePoints(balance) === balancePoints) {
                    requiredBalance = balance;
                    break;
                }
            }
            
            // 计算对应的交易量
            const requiredVolume = volumePoints > 0 ? Math.pow(2, volumePoints - 1) * 2 : 0;
            
            // 只添加真正的组合方案（余额和交易量都大于0）
            if (requiredBalance > 0 && requiredVolume > 0) {
                options.push({
                    balance: requiredBalance,
                    balancePoints: balancePoints,
                    volume: requiredVolume,
                    volumePoints: volumePoints,
                    totalPoints: balancePoints + volumePoints,
                    totalBalance: requiredBalance,
                    totalVolume: requiredVolume
                });
            }
        }
        
        // 如果没有找到任何组合方案
        if (options.length === 0) {
            return `没有找到合适的组合方案（需要同时增加余额和交易量）`;
        }
        
        // 按总成本排序（余额 + 交易量）
        options.sort((a, b) => (a.totalBalance + a.totalVolume) - (b.totalBalance + b.totalVolume));
        
        // 生成详细的结果HTML
        let resultHTML = `<div class="combined-options">`;
        
        // 显示前三个最优方案
        const topOptions = options.slice(0, 3);
        
        topOptions.forEach((option, index) => {
            resultHTML += `
                <div class="option-detail">
                    <h5>组合方案 ${index + 1}</h5>
                    <p>• 余额: <strong>${option.balance.toLocaleString()}</strong> 美元 (${option.balancePoints}积分/天)</p>
                    <p>• 交易量: <strong>${option.volume.toLocaleString()}</strong> 美元/天 (${option.volumePoints}积分/天)</p>
                    <p>• 总积分: <strong>${option.totalPoints}</strong> 积分/天</p>
                    <p>• 15天总积分: <strong>${option.totalPoints * 15}</strong></p>
                </div>
            `;
        });
        
        resultHTML += `</div>`;
        
        return resultHTML;
    }
    
    // 添加积分提升计算按钮事件监听器
    calculateUpgradeButton.addEventListener('click', calculateUpgradeOptions);
    
    // 为积分提升计算器输入框添加回车键事件监听器
    currentPointsInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            calculateUpgradeOptions();
        }
    });
    
    targetPointsInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            calculateUpgradeOptions();
        }
    });

    // 资金分配计算器功能
    function calculateFundAllocation() {
        const availableFunds = parseFloat(availableFundsInput.value) || 0;
        
        if (availableFunds <= 0) {
            optimalAllocationResult.textContent = "请输入有效的可用资金";
            pointsAnalysisResult.textContent = "请输入有效的可用资金";
            return;
        }
        
        // 计算最优分配方案
        const allocationResult = calculateOptimalAllocation(availableFunds);
        optimalAllocationResult.innerHTML = allocationResult.allocationHTML;
        
        // 计算积分收益分析
        const analysisResult = calculatePointsAnalysis(allocationResult.balance, allocationResult.tradingVolume);
        pointsAnalysisResult.innerHTML = analysisResult;
    }
    
    // 计算最优资金分配方案
    function calculateOptimalAllocation(availableFunds) {
        // 定义不同的分配比例
        const allocationRatios = [
            { balance: 1.0, trading: 0.0 },  // 全部用于余额
            { balance: 0.8, trading: 0.2 },
            { balance: 0.6, trading: 0.4 },
            { balance: 0.5, trading: 0.5 },
            { balance: 0.4, trading: 0.6 },
            { balance: 0.2, trading: 0.8 },
            { balance: 0.0, trading: 1.0 }   // 全部用于交易
        ];
        
        // 计算每种分配方案的积分
        const allocationOptions = allocationRatios.map(ratio => {
            const balanceAmount = availableFunds * ratio.balance;
            // 交易量使用可用资金的一定比例作为每日交易量
            const tradingAmount = availableFunds * ratio.trading;
            
            const balancePoints = calculateBalancePoints(balanceAmount);
            const tradingPoints = calculateTradingPoints(tradingAmount);
            const totalPoints = balancePoints + tradingPoints;
            
            return {
                balance: balanceAmount,
                trading: tradingAmount,
                balancePoints: balancePoints,
                tradingPoints: tradingPoints,
                totalPoints: totalPoints,
                ratio: ratio
            };
        });
        
        // 按总积分排序
        allocationOptions.sort((a, b) => b.totalPoints - a.totalPoints);
        
        // 找到最优方案
        const optimalOption = allocationOptions[0];
        
        // 生成分配方案HTML
        let allocationHTML = `
            <div class="allocation-detail">
                <h5>最优资金分配方案</h5>
                <p>• 余额分配: <strong>${optimalOption.balance.toLocaleString()}</strong> 美元 (${(optimalOption.ratio.balance * 100).toFixed(0)}%)</p>
                <p>• 交易量分配: <strong>${optimalOption.trading.toLocaleString()}</strong> 美元/天 (${(optimalOption.ratio.trading * 100).toFixed(0)}%)</p>
                <p>• 余额积分: <strong>${optimalOption.balancePoints}</strong> 积分/天</p>
                <p>• 交易积分: <strong>${optimalOption.tradingPoints}</strong> 积分/天</p>
                <p>• 总积分: <strong>${optimalOption.totalPoints}</strong> 积分/天</p>
                <p>• 15天总积分: <strong>${optimalOption.totalPoints * 15}</strong></p>
            </div>
        `;
        
        // 添加图表
        allocationHTML += `
            <div class="allocation-chart">
                <div class="chart-bar" style="left: 10%; height: ${(optimalOption.ratio.balance * 100)}%; background: var(--rpg-brown);">
                    <div class="chart-label">余额 ${(optimalOption.ratio.balance * 100).toFixed(0)}%</div>
                </div>
                <div class="chart-bar" style="left: 60%; height: ${(optimalOption.ratio.trading * 100)}%; background: var(--rpg-dark-brown);">
                    <div class="chart-label">交易 ${(optimalOption.ratio.trading * 100).toFixed(0)}%</div>
                </div>
            </div>
        `;
        
        return {
            allocationHTML: allocationHTML,
            balance: optimalOption.balance,
            tradingVolume: optimalOption.trading
        };
    }
    
    // 计算积分收益分析
    function calculatePointsAnalysis(balance, tradingVolume) {
        const balancePoints = calculateBalancePoints(balance);
        const tradingPoints = calculateTradingPoints(tradingVolume);
        const totalPoints = balancePoints + tradingPoints;
        const totalPoints15Days = totalPoints * 15;
        
        // 计算积分效率（每1000美元获得的积分）
        const balanceEfficiency = balance > 0 ? (balancePoints / (balance / 1000)).toFixed(2) : 0;
        const tradingEfficiency = tradingVolume > 0 ? (tradingPoints / (tradingVolume / 1000)).toFixed(2) : 0;
        
        return `
            <div class="allocation-detail">
                <h5>积分收益分析</h5>
                <p>• 余额积分效率: <strong>${balanceEfficiency}</strong> 积分/1000美元</p>
                <p>• 交易积分效率: <strong>${tradingEfficiency}</strong> 积分/1000美元</p>
                <p>• 每日总积分: <strong>${totalPoints}</strong> 积分</p>
                <p>• 15天总积分: <strong>${totalPoints15Days}</strong> 积分</p>
                <p>• 积分获取速度: <strong>${(totalPoints15Days / 15).toFixed(1)}</strong> 积分/天</p>
            </div>
        `;
    }
    
    // 添加资金分配计算按钮事件监听器
    calculateAllocationButton.addEventListener('click', calculateFundAllocation);
    
    // 为资金分配计算器输入框添加回车键事件监听器
    availableFundsInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            calculateFundAllocation();
        }
    });
}); 