// TikTok Mass Unfollow Script
// WARNING: Use at your own risk. TikTok may detect automated behavior and restrict your account.

(function() {
    'use strict';
    
    let isRunning = false;
    let unfollowCount = 0;
    let totalUnfollowed = 0;
    let consecutiveFailures = 0;
    
    // Generate random delays to mimic human behavior
    function getRandomDelay() {
        return Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000; // 3-7 seconds
    }
    
    // Add random mouse movements to simulate human activity
    function simulateHumanActivity() {
        const randomX = Math.floor(Math.random() * window.innerWidth);
        const randomY = Math.floor(Math.random() * window.innerHeight);
        
        const event = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: randomX,
            clientY: randomY
        });
        document.dispatchEvent(event);
    }
    
    // Smart pause when rate limiting might be detected
    function adaptiveDelay() {
        if (consecutiveFailures > 2) {
            console.log('Adaptive delay: Taking a longer break to avoid detection...');
            return getRandomDelay() * 3; // 9-21 seconds
        } else if (totalUnfollowed > 0 && totalUnfollowed % 20 === 0) {
            console.log('Milestone break: Pausing for 30-60 seconds...');
            return Math.floor(Math.random() * 30000) + 30000; // 30-60 seconds
        }
        return getRandomDelay();
    }
    
    // Function to find and click unfollow buttons
    function unfollowNext() {
        // Common selectors for TikTok follow/unfollow buttons
        const followingButtons = document.querySelectorAll('[data-e2e="follow-button"]');
        const followButtons = document.querySelectorAll('button[data-e2e="follow-button"]');
        const buttonSelectors = [
            'button[data-e2e="follow-button"]',
            'button[aria-label*="following"]',
            'button[aria-label*="Following"]',
            'button:contains("Following")',
            '.follow-button.following',
            '[data-testid="follow-button"]'
        ];
        
        let unfollowButton = null;
        
        // Try different selectors to find following buttons
        for (let selector of buttonSelectors) {
            const buttons = document.querySelectorAll(selector);
            for (let button of buttons) {
                const buttonText = button.textContent?.toLowerCase() || '';
                const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
                
                if (buttonText.includes('following') || ariaLabel.includes('following')) {
                    unfollowButton = button;
                    break;
                }
            }
            if (unfollowButton) break;
        }
        
        // Alternative: Look for buttons with "Following" text
        if (!unfollowButton) {
            const allButtons = document.querySelectorAll('button');
            for (let button of allButtons) {
                if (button.textContent?.trim() === 'Following') {
                    unfollowButton = button;
                    break;
                }
            }
        }
        
        if (unfollowButton) {
            // Add random delay before clicking to simulate human hesitation
            setTimeout(() => {
                unfollowButton.click();
                totalUnfollowed++;
                consecutiveFailures = 0;
                console.log(`Unfollowed user #${totalUnfollowed}`);
                
                // Simulate human activity
                simulateHumanActivity();
                
                // Variable scroll amounts
                const scrollAmount = Math.floor(Math.random() * 400) + 200; // 200-600px
                window.scrollBy(0, scrollAmount);
            }, Math.floor(Math.random() * 1000) + 500); // 0.5-1.5 second delay
            
            return true;
        } else {
            consecutiveFailures++;
            console.log('No more following buttons found. Scrolling to load more...');
            window.scrollBy(0, Math.floor(Math.random() * 300) + 400); // 400-700px
            return false;
        }
    }
    
    // Recursive function to continue the unfollow process
    function startNextCycle() {
        if (!isRunning) return;
        
        const success = unfollowNext();
        
        if (!success) {
            unfollowCount++;
            if (unfollowCount >= 8) {
                console.log('No more users to unfollow or reached end of list.');
                console.log(`Total unfollowed: ${totalUnfollowed}`);
                stopUnfollowing();
                return;
            }
        } else {
            unfollowCount = 0;
        }
        
        // Schedule next cycle with adaptive delay
        setTimeout(() => {
            if (isRunning) {
                startNextCycle();
            }
        }, adaptiveDelay());
    }
    
    // Main unfollow function with delay
    function startUnfollowing() {
        if (isRunning) {
            console.log('Script is already running!');
            return;
        }
        
        isRunning = true;
        console.log('Starting enhanced mass unfollow process...');
        console.log('Make sure you are on your "Following" page!');
        
        // Start the first cycle
        startNextCycle();
    }
    
    // Function to stop the unfollowing process
    function stopUnfollowing() {
        isRunning = false;
        console.log('Unfollowing process stopped.');
        console.log(`Total users unfollowed: ${totalUnfollowed}`);
    }
    
    // Create control buttons (optional)
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.zIndex = '10000';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        panel.style.color = 'white';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.fontFamily = 'Arial, sans-serif';
        
        const startBtn = document.createElement('button');
        startBtn.textContent = 'Start Unfollowing';
        startBtn.style.marginRight = '5px';
        startBtn.onclick = startUnfollowing;
        
        const stopBtn = document.createElement('button');
        stopBtn.textContent = 'Stop';
        stopBtn.onclick = stopUnfollowing;
        
        const counter = document.createElement('div');
        counter.id = 'unfollowCounter';
        counter.textContent = `Unfollowed: ${totalUnfollowed}`;
        
        panel.appendChild(startBtn);
        panel.appendChild(stopBtn);
        panel.appendChild(counter);
        
        document.body.appendChild(panel);
        
        // Update counter periodically
        setInterval(() => {
            document.getElementById('unfollowCounter').textContent = `Unfollowed: ${totalUnfollowed}`;
        }, 1000);
    }
    
    console.log('Created by Warsing');
    console.log('1. Go to your TikTok profile');
    console.log('2. Click on "Following" to see your following list');
    console.log('3. Run startUnfollowing() to begin');
    console.log('4. Run stopUnfollowing() to stop');
    window.startUnfollowing = startUnfollowing;
    window.stopUnfollowing = stopUnfollowing;
    
    // Optionally create visual control panel
    createControlPanel();
    
})();
