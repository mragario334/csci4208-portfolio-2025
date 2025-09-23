# Lab 05 — Phaser Dodger Game

**Live URL:** https://mragario334.github.io/csci4208-portfolio-2025/labs/lab-05/index.html  
**External Repo:** https://github.com/mragario334/csci4208-portfolio-2025  

## How to Demo (grader script)
1. Open the live URL above in a browser.  
2. Use the arrow keys to move the player and the spacebar to fire projectiles.  
3. Show collision features:
   - Player destroys enemies with projectiles.  
   - Enemies fire projectiles at the player.  
   - Power-ups spawn randomly and modify abilities (slay all enemies or upgrade projectile size).  
4. Show scoring system updates in the HUD.  
5. On game over, enter a name if a new high score is achieved.  

## Feature Checklist
- [x] Player movement (arrow keys)  
- [x] Player attack with projectile (spacebar)  
- [x] Enemy spawning and attacking  
- [x] Projectile collisions with enemies  
- [x] Power-ups (projectile boost + slay all enemies)  
- [x] Score tracking and high score entry  
- [x] Background scrolling for visual feedback  

## Run Locally
- **Prereqs / Install:**  
  - Node.js installed  
  - Install `http-server` globally:  
    ```bash
    npm install -g http-server
    ```
- **Start / Dev:**  
  In the project root, run:  
  ```bash
  http-server
  ```
  Then, go to the url provided.

## Notes
- Game currently restarts immediately after game over. Could be improved with a "restart screen."  
- Enemy spawn rate and projectile speeds can be adjusted for balance.  
- Power-up probabilities are randomized and may not always appear during short play sessions.
