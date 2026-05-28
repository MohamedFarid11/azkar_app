/**
 * Ultra-Premium Islamic Azkar Core Application Engine
 * Dynamic Architecture, LocalStorage States Matrix, UI Components Lifecycle Control
 */

document.addEventListener("DOMContentLoaded", () => {
    // Application Global Memory State
    let databaseAzkar = [];
    let stateCounters = JSON.parse(localStorage.getItem("azkar_counters_2026")) || {};
    let favoriteList = JSON.parse(localStorage.getItem("azkar_favorites_2026")) || [];
    let trackingStreak = parseInt(localStorage.getItem("azkar_streak_2026")) || 1;
    let selectedActiveCategory = "all";
    let searchFilterQuery = "";

    // DOM Elements Mapping References
    const splashScreen = document.getElementById("splash-screen");
    const cardsGridContainer = document.getElementById("azkar-cards-container");
    const categoriesTabsTrack = document.getElementById("category-tabs-container");
    const globalSearchField = document.getElementById("search-input");
    const streakDisplayMetric = document.getElementById("streak-count");
    const dynamicGlobalProgress = document.getElementById("global-progress");

    // Splash Screen Initialization Engine Lifecycle
    setTimeout(() => {
        if(splashScreen) {
            splashScreen.classList.add("fade-out");
        }
        verifyAndRenewStreakMetrics();
    }, 2000);

    // Initialize Particle Atmosphere Effect Canvas Core
    generateParticlesAtmosphere();

    // Fetch the Complete Database from JSON Pipeline File
    fetch('azkar.json')
        .then(response => {
            if (!response.ok) throw new Error('Network file dynamic access error code.');
            return response.json();
        })
        .then(parsedData => {
            databaseAzkar = normalizeDataMatrix(parsedData);
            compileDynamicCategoriesTabs();
            renderEngineCardsDashboard();
            calculateGlobalProgressMetrics();
        })
        .catch(err => {
            console.error("Dynamic parsing engine error critical failure: ", err);
            cardsGridContainer.innerHTML = `
                <div class="initial-loading">
                    <i class="fa-solid fa-triangle-exclamation" style="color:#D4AF37"></i>
                    <p>عذراً، فشل تحميل ملف الأذكار. يرجى التأكد من مسار الملف azkar.json</p>
                </div>`;
        });

    /**
     * Standardizes variant variations of JSON object key/value configurations
     */
    function normalizeDataMatrix(rawData) {
        return rawData.map((item, idx) => {
            const baseCount = parseInt(item.count || item.repeat || item.次数 || 1);
            return {
                id: `zekr-${idx}-${hashString(item.zekr || item.text || item.content)}`,
                category: item.category || item.section || "أذكار عامة",
                zekr: item.zekr || item.text || item.content || "",
                description: item.description || item.notes || "",
                initialTarget: baseCount
            };
        });
    }

    /**
     * Generates a structural deterministic ID component string hash map
     */
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash).toString(16);
    }

    /**
     * Extracts categorical parameters dynamically to construct navigational filters
     */
    function compileDynamicCategoriesTabs() {
        const uniqueCategories = [...new Set(databaseAzkar.map(item => item.category.trim()))];
        
        uniqueCategories.forEach(cat => {
            const tabBtn = document.createElement("button");
            tabBtn.className = "tab-btn";
            tabBtn.setAttribute("data-category", cat);
            tabBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i> ${cat}`;
            categoriesTabsTrack.appendChild(tabBtn);
        });

        // Event Handling Delegation for dynamic structural tabs navigation
        const allActionButtons = document.querySelectorAll(".tab-btn, .mobile-nav-btn");
        allActionButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const targetBtn = e.currentTarget;
                
                // Clear state structures across active targets
                document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
                document.querySelectorAll(".mobile-nav-btn").forEach(m => m.classList.remove("active"));

                const assignedCategory = targetBtn.getAttribute("data-category") || 
                    (targetBtn.id === "mob-fav-btn" ? "favorites" : "all");

                selectedActiveCategory = assignedCategory.trim();

                // Set operational active syncs
                const matchingTab = document.querySelector(`.tab-btn[data-category="${assignedCategory}"]`);
                if(matchingTab) matchingTab.classList.add("active");
                
                if(targetBtn.classList.contains("mobile-nav-btn")) {
                    targetBtn.classList.add("active");
                } else if(assignedCategory === "favorites") {
                    document.getElementById("mob-fav-btn").classList.add("active");
                } else {
                    document.getElementById("mob-home-btn").classList.add("active");
                }

                if(targetBtn.id === "mob-search-btn") {
                    globalSearchField.focus();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }

                renderEngineCardsDashboard();
            });
        });
    }

    /**
     * Core Visual Dashboard Rendering Engine System - Updated Filter Logic
     */
    function renderEngineCardsDashboard() {
        cardsGridContainer.innerHTML = "";

        // Query Filter Matrix Pipeline Processing
        const processedFilteredSet = databaseAzkar.filter(item => {
            // 1. التحقق من مطابقة القسم الحالي والقسم النشط المختار
            let belongsToCategory = false;
            if (selectedActiveCategory === "all") {
                belongsToCategory = true;
            } else if (selectedActiveCategory === "favorites") {
                belongsToCategory = favoriteList.includes(item.id);
            } else {
                belongsToCategory = (item.category.trim() === selectedActiveCategory);
            }

            // 2. التحقق من مطابقة البحث إن وجد
            const textSearchMatch = item.zekr.includes(searchFilterQuery) || 
                                    item.category.includes(searchFilterQuery) ||
                                    item.description.includes(searchFilterQuery);

            return belongsToCategory && textSearchMatch;
        });

        if (processedFilteredSet.length === 0) {
            cardsGridContainer.innerHTML = `
                <div class="initial-loading">
                    <i class="fa-solid fa-magnifying-glass-chart" style="color:var(--gold)"></i>
                    <p>لا توجد أذكار مضافة في هذا القسم حالياً.</p>
                </div>`;
            return;
        }

        processedFilteredSet.forEach(item => {
            const currentCountState = stateCounters[item.id] !== undefined ? stateCounters[item.id] : item.initialTarget;
            const isCompleted = currentCountState === 0;
            const isFavorite = favoriteList.includes(item.id);

            // Compute SVG Angular Ring Parameters
            const circumference = 2 * Math.PI * 10; // r=10 svg scaled viewbox params
            const percentageProgress = isCompleted ? 100 : ((item.initialTarget - currentCountState) / item.initialTarget) * 100;
            const strokeDashoffset = circumference - (percentageProgress / 100) * circumference;

            const cardNode = document.createElement("div");
            cardNode.className = `zekr-card ${isCompleted ? 'completed-state' : ''}`;
            cardNode.setAttribute("data-id", item.id);

            cardNode.innerHTML = `
                <div class="card-top">
                    <span class="category-badge">${item.category}</span>
                    <div class="actions-cluster">
                        <button class="action-btn share-trigger" title="مشاركة الذكر">
                            <i class="fa-solid fa-share-nodes"></i>
                        </button>
                        <button class="action-btn favorite-trigger ${isFavorite ? 'fav-active' : ''}" title="إضافة للمفضلة">
                            <i class="fa-solid fa-star"></i>
                        </button>
                    </div>
                </div>
                <div class="zekr-main-text">${item.zekr}</div>
                ${item.description ? `<div class="zekr-description">${item.description}</div>` : ''}
                <div class="card-footer">
                    <span class="target-badge-hint">العدد المستهدف: ${item.initialTarget}</span>
                    <div class="counter-interactive-wrapper">
                        <svg class="svg-ring-container" viewBox="0 0 24 24">
                            <circle class="ring-track" cx="12" cy="12" r="10"/>
                            <circle class="ring-fill" cx="12" cy="12" r="10" 
                                    stroke-dasharray="${circumference}" 
                                    stroke-dashoffset="${strokeDashoffset}"/>
                        </svg>
                        <div class="counter-digit-display">
                            ${isCompleted ? '<i class="fa-solid fa-check"></i>' : currentCountState}
                        </div>
                    </div>
                </div>
            `;

            // Operational Subsystems Integrations Framework
            bindCardInteractionEvents(cardNode, item, circumference);
            cardsGridContainer.appendChild(cardNode);
        });
    }

    /**
     * Connect Interaction event handling logic to specific component items
     */
    function bindCardInteractionEvents(cardNode, item, circumference) {
        const counterTargetHitbox = cardNode.querySelector(".counter-interactive-wrapper");
        const favoriteActionButton = cardNode.querySelector(".favorite-trigger");
        const shareActionButton = cardNode.querySelector(".share-trigger");

        // Decrement Counter Matrix Engine Event Listener Trigger
        counterTargetHitbox.addEventListener("click", (e) => {
            e.stopPropagation();
            let stateValue = stateCounters[item.id] !== undefined ? stateCounters[item.id] : item.initialTarget;

            if (stateValue <= 0) return; // Prevent operational index underflow

            stateValue--;
            stateCounters[item.id] = stateValue;
            localStorage.setItem("azkar_counters_2026", JSON.stringify(stateCounters));

            // Dynamic Counter Component Repaint Processing Animation Frame Update
            const displayDigits = counterTargetHitbox.querySelector(".counter-digit-display");
            const physicalRing = counterTargetHitbox.querySelector(".ring-fill");

            const updatePercentage = ((item.initialTarget - stateValue) / item.initialTarget) * 100;
            const updatedOffset = circumference - (updatePercentage / 100) * circumference;
            physicalRing.style.strokeDashoffset = updatedOffset;

            displayDigits.style.transform = "translate(-50%, -50%) scale(0.8)";
            
            setTimeout(() => {
                if (stateValue === 0) {
                    cardNode.classList.add("completed-state");
                    displayDigits.innerHTML = '<i class="fa-solid fa-check"></i>';
                    triggerConfettiPremiumSuccess();
                } else {
                    displayDigits.textContent = stateValue;
                }
                displayDigits.style.transform = "translate(-50%, -50%) scale(1)";
                calculateGlobalProgressMetrics();
            }, 150);
        });

        // Toggle Favorites Management Matrix Processing Pipeline
        favoriteActionButton.addEventListener("click", (e) => {
            e.stopPropagation();
            if (favoriteList.includes(item.id)) {
                favoriteList = favoriteList.filter(id => id !== item.id);
                favoriteActionButton.classList.remove("fav-active");
                if(selectedActiveCategory === "favorites") {
                    cardNode.style.opacity = "0";
                    setTimeout(() => renderEngineCardsDashboard(), 300);
                }
            } else {
                favoriteList.push(item.id);
                favoriteActionButton.classList.add("fav-active");
            }
            localStorage.setItem("azkar_favorites_2026", JSON.stringify(favoriteList));
        });

        // Web Native Share Integration Core Hook Module
        shareActionButton.addEventListener("click", (e) => {
            e.stopPropagation();
            const shareStringText = `"${item.zekr}"\nالتصنيف: ${item.category} - من منصة أذكاري`;
            if (navigator.share) {
                navigator.share({ title: 'أذكاري بقلم النور', text: shareStringText })
                    .catch(console.error);
            } else {
                navigator.clipboard.writeText(shareStringText).then(() => {
                    alert("تم نسخ نص الذكر المبارك بنجاح لمشاركته.");
                });
            }
        });
    }

    /**
     * Compute system operational statistics processing percentages
     */
    function calculateGlobalProgressMetrics() {
        if(databaseAzkar.length === 0) return;
        
        let completedUnitsTotal = 0;
        databaseAzkar.forEach(item => {
            if (stateCounters[item.id] === 0) {
                completedUnitsTotal++;
            }
        });

        const unifiedScorePercentage = Math.round((completedUnitsTotal / databaseAzkar.length) * 100);
        if (dynamicGlobalProgress) {
            dynamicGlobalProgress.style.width = `${unifiedScorePercentage}%`;
        }
    }

    /**
     * Live Search Input Context Tracking Query Engine Function
     */
    globalSearchField.addEventListener("input", (e) => {
        searchFilterQuery = e.target.value.trim();
        renderEngineCardsDashboard();
    });

    /**
     * Confetti Particle Engine Execution Trigger Block
     */
    function triggerConfettiPremiumSuccess() {
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#D4AF37', '#2D6A4F', '#40916C', '#FFFFFF']
        });
    }

    /**
     * Streak Date Verification and Incremental Automation Subsystem Engine
     * (تم تعديل هذا الجزء فقط لتصفير العدادات تلقائياً عند استشعار يوم جديد)
     */
    function verifyAndRenewStreakMetrics() {
        const currentDateStampString = new Date().toDateString();
        const absoluteLastSavedStamp = localStorage.getItem("azkar_last_interaction_date");

        if (absoluteLastSavedStamp) {
            const parsedPreviousDate = new Date(absoluteLastSavedStamp);
            const parsedCurrentDate = new Date(currentDateStampString);
            const differenceInTimeDuration = parsedCurrentDate - parsedPreviousDate;
            const singleDayIntervalMilliseconds = 1000 * 60 * 60 * 24;

            // [تعديل] إذا تم استشعار يوم جديد، قم بتصفير عدادات الأذكار المنجزة فوراً
            if (absoluteLastSavedStamp !== currentDateStampString) {
                localStorage.removeItem("azkar_counters_2026");
                stateCounters = {}; // صيانة الحافظة الحالية في الذاكرة لتحديث الواجهة
            }

            if (differenceInTimeDuration === singleDayIntervalMilliseconds) {
                trackingStreak++;
                localStorage.setItem("azkar_streak_2026", trackingStreak);
            } else if (differenceInTimeDuration > singleDayIntervalMilliseconds) {
                trackingStreak = 1; // System Streak structural fallback reset action 
                localStorage.setItem("azkar_streak_2026", trackingStreak);
            }
        }
        localStorage.setItem("azkar_last_interaction_date", currentDateStampString);
        if (streakDisplayMetric) {
            streakDisplayMetric.textContent = trackingStreak;
        }
    }

    /**
     * Ambient Floating Particle Microscopic Canvas Matrix Simulation
     */
    function generateParticlesAtmosphere() {
        const particleOverlayTrack = document.getElementById("particles");
        if(!particleOverlayTrack) return;
        
        for (let i = 0; i < 25; i++) {
            const specElement = document.createElement("div");
            specElement.style.position = "absolute";
            specElement.style.width = `${Math.random() * 3 + 2}px`;
            specElement.style.height = specElement.style.width;
            specElement.style.background = Math.random() > 0.5 ? "var(--gold)" : "var(--primary-glow)";
            specElement.style.borderRadius = "50%";
            specElement.style.top = `${Math.random() * 100}%`;
            specElement.style.left = `${Math.random() * 100}%`;
            specElement.style.opacity = Math.random() * 0.5 + 0.2;
            specElement.style.filter = "blur(1px)";
            
            // Inject hardware accelerated movement animation transforms
            specElement.animate([
                { transform: 'translateY(0px) translateX(0px)', opacity: 0.2 },
                { transform: `translateY(-${Math.random() * 80 + 40}px) translateX(${Math.random() * 40 - 20}px)`, opacity: 0.6 },
                { transform: 'translateY(-150px) translateX(0px)', opacity: 0 }
            ], {
                duration: Math.random() * 6000 + 6000,
                iterations: Infinity,
                easing: 'ease-in-out'
            });

            particleOverlayTrack.appendChild(specElement);
        }
    }
});