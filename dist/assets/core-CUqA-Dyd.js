class i{constructor(){this.isDevelopment=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.hostname==="",this.isDebugMode=localStorage.getItem("debug")==="true"}log(...e){(this.isDevelopment||this.isDebugMode)&&console.log(...e)}warn(...e){(this.isDevelopment||this.isDebugMode)&&console.warn(...e)}error(...e){console.error(...e)}info(...e){(this.isDevelopment||this.isDebugMode)&&console.info(...e)}enableDebug(){localStorage.setItem("debug","true"),this.isDebugMode=!0,console.log("🐛 Debug mode: AÇIK")}disableDebug(){localStorage.removeItem("debug"),this.isDebugMode=!1,console.log("🐛 Debug mode: KAPALI")}isDev(){return this.isDevelopment||this.isDebugMode}}const o=new i;typeof window<"u"&&(window.enableDebug=()=>o.enableDebug(),window.disableDebug=()=>o.disableDebug());console.log("✅ Logger modülü yüklendi");class a{constructor(){this.errors=[],this.maxErrors=50,this.isInitialized=!1}init(){this.isInitialized||(this.setupGlobalHandlers(),this.addStyles(),this.isInitialized=!0,console.log("✅ Error Handler başlatıldı"))}setupGlobalHandlers(){window.addEventListener("error",r=>{this.handleError({type:"error",message:r.message,source:r.filename,line:r.lineno,column:r.colno,error:r.error,stack:r.error?.stack}),r.preventDefault()}),window.addEventListener("unhandledrejection",r=>{this.handleError({type:"promise",message:"Unhandled Promise Rejection",reason:r.reason,error:r.reason,stack:r.reason?.stack}),r.preventDefault()});const e=console.error;console.error=(...r)=>{e.apply(console,r),(r[0]?.includes?.("CRITICAL")||r[0]?.includes?.("FATAL"))&&this.handleError({type:"console",message:r.join(" "),timestamp:new Date().toISOString()})}}handleError(e){const r={...e,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,url:window.location.href};this.errors.push(r),this.errors.length>this.maxErrors&&this.errors.shift(),console.error("🔴 Global Error:",r),this.showErrorToUser(this.getUserFriendlyMessage(r))}getUserFriendlyMessage(e){return e.message?.includes?.("fetch")||e.message?.includes?.("network")?"Bağlantı hatası. İnternet bağlantınızı kontrol edin.":e.message?.includes?.("data")||e.message?.includes?.("load")?"Veri yüklenirken hata oluştu. Lütfen sayfayı yenileyin.":e.message?.includes?.("chart")||e.message?.includes?.("Chart")?"Grafik oluşturulurken hata oluştu.":"Bir hata oluştu. Lütfen sayfayı yenileyin veya destek ekibiyle iletişime geçin."}showErrorToUser(e){const r=document.querySelector(".error-toast");r&&r.remove();const t=document.createElement("div");t.className="error-toast",t.innerHTML=`
            <div class="error-toast-content">
                <span class="error-toast-icon">⚠️</span>
                <span class="error-toast-message">${e}</span>
                <button class="error-toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `,document.body.appendChild(t),setTimeout(()=>{t.parentElement&&(t.style.animation="slideOut 0.3s ease-in",setTimeout(()=>t.remove(),300))},5e3)}addStyles(){if(document.getElementById("error-handler-styles"))return;const e=document.createElement("style");e.id="error-handler-styles",e.textContent=`
            .error-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #f44336 0%, #e53935 100%);
                color: white;
                padding: 0;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(244, 67, 54, 0.3);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
                min-width: 300px;
            }
            
            .error-toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px;
            }
            
            .error-toast-icon {
                font-size: 24px;
                flex-shrink: 0;
            }
            
            .error-toast-message {
                flex: 1;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .error-toast-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 24px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
                flex-shrink: 0;
            }
            
            .error-toast-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            
            @media (max-width: 768px) {
                .error-toast {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    min-width: 0;
                }
            }
        `,document.head.appendChild(e)}getErrors(){return[...this.errors]}clearErrors(){this.errors=[]}getRecentErrors(e=10){return this.errors.slice(-e)}}const s=new a;typeof window<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>s.init()):s.init());console.log("✅ Error Handler modülü yüklendi");export{o as l};
