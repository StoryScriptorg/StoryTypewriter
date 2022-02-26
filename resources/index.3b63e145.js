var Neutralino = function(e1) {
    function t1(e2, t2, n, i) {
        return new (n || (n = Promise))(function(o, r) {
            function s(e) {
                try {
                    c(i.next(e));
                } catch (e3) {
                    r(e3);
                }
            }
            function a(e) {
                try {
                    c(i.throw(e));
                } catch (e4) {
                    r(e4);
                }
            }
            function c(e5) {
                var t;
                e5.done ? o(e5.value) : (t = e5.value, t instanceof n ? t : new n(function(e) {
                    e(t);
                })).then(s, a);
            }
            c((i = i.apply(e2, t2 || [])).next());
        });
    }
    function n1(e, t) {
        let n = new CustomEvent(e, {
            detail: t
        });
        return window.dispatchEvent(n), Promise.resolve({
            success: !0,
            message: "Message dispatched"
        });
    }
    let i1, o1 = {
    }, r1 = [], s1 = {
    };
    function a1() {
        window.NL_TOKEN && sessionStorage.setItem("NL_TOKEN", window.NL_TOKEN), i1 = new WebSocket(`ws://${window.location.hostname}:${window.NL_PORT}`), (function() {
            if (Neutralino.events.on("ready", ()=>t1(this, void 0, void 0, function*() {
                    if (yield u1(r1), !window.NL_EXTENABLED) return;
                    let e = yield Neutralino.extensions.getStats();
                    for (let t of e.connected)n1("extensionReady", t);
                })
            ), Neutralino.events.on("extClientConnect", (e)=>{
                n1("extensionReady", e.detail);
            }), !window.NL_EXTENABLED) return;
            Neutralino.events.on("extensionReady", (e)=>t1(this, void 0, void 0, function*() {
                    e.detail in s1 && (yield u1(s1[e.detail]), delete s1[e.detail]);
                })
            );
        })(), (function() {
            i1.addEventListener("message", (e)=>{
                var t, r;
                const s = JSON.parse(e.data);
                s.id && s.id in o1 ? ((null === (t = s.data) || void 0 === t ? void 0 : t.error) ? (o1[s.id].reject(s.data.error), "NE_RT_INVTOKN" == s.data.error.code && (i1.close(), document.body.innerText = "", document.write("<code>NE_RT_INVTOKN</code>: Neutralinojs application configuration prevents accepting native calls from this client."))) : (null === (r = s.data) || void 0 === r ? void 0 : r.success) && o1[s.id].resolve(s.data.hasOwnProperty("returnValue") ? s.data.returnValue : s.data), delete o1[s.id]) : s.event && n1(s.event, s.data);
            }), i1.addEventListener("open", (e)=>t1(this, void 0, void 0, function*() {
                    n1("ready");
                })
            ), i1.addEventListener("close", (e)=>t1(this, void 0, void 0, function*() {
                    n1("serverOffline", {
                        code: "NE_CL_NSEROFF",
                        message: "Neutralino server is offline. Try restarting the application"
                    });
                })
            );
        })();
    }
    function c1(e6, t) {
        return new Promise((n, s)=>{
            if ((null == i1 ? void 0 : i1.readyState) != WebSocket.OPEN) return a = {
                method: e6,
                data: t,
                resolve: n,
                reject: s
            }, void r1.push(a);
            var a;
            const c = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (e)=>(e ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16)
            ), u = window.NL_TOKEN || sessionStorage.getItem("NL_TOKEN") || "";
            o1[c] = {
                resolve: n,
                reject: s
            }, i1.send(JSON.stringify({
                id: c,
                method: e6,
                data: t,
                accessToken: u
            }));
        });
    }
    function u1(e7) {
        return t1(this, void 0, void 0, function*() {
            for(; e7.length > 0;){
                let t = e7.shift();
                try {
                    let e = yield c1(t.method, t.data);
                    t.resolve(e);
                } catch (e) {
                    t.reject(e);
                }
            }
        });
    }
    var d, l, f = Object.freeze({
        __proto__: null,
        createDirectory: function(e) {
            return c1("filesystem.createDirectory", {
                path: e
            });
        },
        removeDirectory: function(e) {
            return c1("filesystem.removeDirectory", {
                path: e
            });
        },
        writeFile: function(e, t) {
            return c1("filesystem.writeFile", {
                path: e,
                data: t
            });
        },
        writeBinaryFile: function(e, t) {
            let n = new Uint8Array(t), i = "";
            for (let e8 of n)i += String.fromCharCode(e8);
            return c1("filesystem.writeBinaryFile", {
                path: e,
                data: window.btoa(i)
            });
        },
        readFile: function(e) {
            return c1("filesystem.readFile", {
                path: e
            });
        },
        readBinaryFile: function(e10) {
            return new Promise((t, n2)=>{
                c1("filesystem.readBinaryFile", {
                    path: e10
                }).then((e)=>{
                    let n = window.atob(e), i = n.length, o = new Uint8Array(i);
                    for(let e9 = 0; e9 < i; e9++)o[e9] = n.charCodeAt(e9);
                    t(o.buffer);
                }).catch((e)=>{
                    n2(e);
                });
            });
        },
        removeFile: function(e) {
            return c1("filesystem.removeFile", {
                path: e
            });
        },
        readDirectory: function(e) {
            return c1("filesystem.readDirectory", {
                path: e
            });
        },
        copyFile: function(e, t) {
            return c1("filesystem.copyFile", {
                source: e,
                destination: t
            });
        },
        moveFile: function(e, t) {
            return c1("filesystem.moveFile", {
                source: e,
                destination: t
            });
        },
        getStats: function(e) {
            return c1("filesystem.getStats", {
                path: e
            });
        }
    });
    !function(e) {
        e.WARNING = "WARNING", e.ERROR = "ERROR", e.INFO = "INFO", e.QUESTION = "QUESTION";
    }(d || (d = {
    })), (function(e) {
        e.OK = "OK", e.OK_CANCEL = "OK_CANCEL", e.YES_NO = "YES_NO", e.YES_NO_CANCEL = "YES_NO_CANCEL", e.RETRY_CANCEL = "RETRY_CANCEL", e.ABORT_RETRY_IGNORE = "ABORT_RETRY_IGNORE";
    })(l || (l = {
    }));
    var w = Object.freeze({
        __proto__: null,
        get Icon () {
            return d;
        },
        get MessageBoxChoice () {
            return l;
        },
        execCommand: function(e, t) {
            return c1("os.execCommand", Object.assign({
                command: e
            }, t));
        },
        getEnv: function(e) {
            return c1("os.getEnv", {
                key: e
            });
        },
        showOpenDialog: function(e, t) {
            return c1("os.showOpenDialog", Object.assign({
                title: e
            }, t));
        },
        showFolderDialog: function(e) {
            return c1("os.showFolderDialog", {
                title: e
            });
        },
        showSaveDialog: function(e, t) {
            return c1("os.showSaveDialog", Object.assign({
                title: e
            }, t));
        },
        showNotification: function(e, t, n) {
            return c1("os.showNotification", {
                title: e,
                content: t,
                icon: n
            });
        },
        showMessageBox: function(e, t, n, i) {
            return c1("os.showMessageBox", {
                title: e,
                content: t,
                choice: n,
                icon: i
            });
        },
        setTray: function(e) {
            return c1("os.setTray", e);
        },
        open: function(e) {
            return c1("os.open", {
                url: e
            });
        },
        getPath: function(e) {
            return c1("os.getPath", {
                name: e
            });
        }
    });
    var m = Object.freeze({
        __proto__: null,
        getMemoryInfo: function() {
            return c1("computer.getMemoryInfo");
        }
    });
    var g, v = Object.freeze({
        __proto__: null,
        setData: function(e, t) {
            return c1("storage.setData", {
                key: e,
                data: t
            });
        },
        getData: function(e) {
            return c1("storage.getData", {
                key: e
            });
        }
    });
    !function(e) {
        e.WARNING = "WARNING", e.ERROR = "ERROR", e.INFO = "INFO";
    }(g || (g = {
    }));
    var p = Object.freeze({
        __proto__: null,
        get LoggerType () {
            return g;
        },
        log: function(e, t) {
            return c1("debug.log", {
                message: e,
                type: t
            });
        }
    });
    var _ = Object.freeze({
        __proto__: null,
        exit: function(e) {
            return c1("app.exit", {
                code: e
            });
        },
        killProcess: function() {
            return c1("app.killProcess");
        },
        restartProcess: function(e11) {
            return new Promise((n, i)=>t1(this, void 0, void 0, function*() {
                    let t3 = window.NL_ARGS.reduce((e, t, n)=>e += " " + t
                    , "");
                    (null == e11 ? void 0 : e11.args) && (t3 += " " + e11.args), yield Neutralino.os.execCommand(t3, {
                        background: !0
                    }), Neutralino.app.exit(), n();
                })
            );
        },
        getConfig: function() {
            return c1("app.getConfig");
        },
        broadcast: function(e, t) {
            return c1("app.broadcast", {
                event: e,
                data: t
            });
        }
    });
    const N = new WeakMap;
    var h = Object.freeze({
        __proto__: null,
        setTitle: function(e) {
            return c1("window.setTitle", {
                title: e
            });
        },
        getTitle: function() {
            return c1("window.getTitle");
        },
        maximize: function() {
            return c1("window.maximize");
        },
        unmaximize: function() {
            return c1("window.unmaximize");
        },
        isMaximized: function() {
            return c1("window.isMaximized");
        },
        minimize: function() {
            return c1("window.minimize");
        },
        setFullScreen: function() {
            return c1("window.setFullScreen");
        },
        exitFullScreen: function() {
            return c1("window.exitFullScreen");
        },
        isFullScreen: function() {
            return c1("window.isFullScreen");
        },
        show: function() {
            return c1("window.show");
        },
        hide: function() {
            return c1("window.hide");
        },
        isVisible: function() {
            return c1("window.isVisible");
        },
        focus: function() {
            return c1("window.focus");
        },
        setIcon: function(e) {
            return c1("window.setIcon", {
                icon: e
            });
        },
        move: function(e, t) {
            return c1("window.move", {
                x: e,
                y: t
            });
        },
        setDraggableRegion: function(e12) {
            return new Promise((n, i)=>{
                const o = e12 instanceof Element ? e12 : document.getElementById(e12);
                let r = 0, s = 0;
                if (!o) return i({
                    code: "NE_WD_DOMNOTF",
                    message: "Unable to find DOM element"
                });
                if (N.has(o)) return i({
                    code: "NE_WD_ALRDREL",
                    message: "This DOM element is already an active draggable region"
                });
                function a(e) {
                    return t1(this, void 0, void 0, function*() {
                        yield Neutralino.window.move(e.screenX - r, e.screenY - s);
                    });
                }
                function c(e) {
                    0 === e.button && (r = e.clientX, s = e.clientY, o.addEventListener("pointermove", a), o.setPointerCapture(e.pointerId));
                }
                function u(e) {
                    o.removeEventListener("pointermove", a), o.releasePointerCapture(e.pointerId);
                }
                o.addEventListener("pointerdown", c), o.addEventListener("pointerup", u), N.set(o, {
                    pointerdown: c,
                    pointerup: u
                }), n({
                    success: !0,
                    message: "Draggable region was activated"
                });
            });
        },
        unsetDraggableRegion: function(e) {
            return new Promise((t, n)=>{
                const i = e instanceof Element ? e : document.getElementById(e);
                if (!i) return n({
                    code: "NE_WD_DOMNOTF",
                    message: "Unable to find DOM element"
                });
                if (!N.has(i)) return n({
                    code: "NE_WD_NOTDRRE",
                    message: "DOM element is not an active draggable region"
                });
                const { pointerdown: o , pointerup: r  } = N.get(i);
                i.removeEventListener("pointerdown", o), i.removeEventListener("pointerup", r), N.delete(i), t({
                    success: !0,
                    message: "Draggable region was deactivated"
                });
            });
        },
        setSize: function(e13) {
            return new Promise((n, i)=>t1(this, void 0, void 0, function*() {
                    let t = yield Neutralino.window.getSize();
                    c1("window.setSize", e13 = Object.assign(Object.assign({
                    }, t), e13)).then((e)=>{
                        n(e);
                    }).catch((e)=>{
                        i(e);
                    });
                })
            );
        },
        getSize: function() {
            return c1("window.getSize");
        },
        setAlwaysOnTop: function(e) {
            return c1("window.setAlwaysOnTop", {
                onTop: e
            });
        },
        create: function(e14, t4) {
            return new Promise((n3, i)=>{
                function o(e) {
                    return "string" != typeof e || (e = e.trim()).includes(" ") && (e = `"${e}"`), e;
                }
                let r = window.NL_ARGS.reduce((e, t, n)=>((t.includes("--path=") || t.includes("--debug-mode") || t.includes("--load-dir-res") || 0 == n) && (e += " " + o(t)), e)
                , "");
                r += " --url=" + o(e14);
                for(let e15 in t4){
                    if ("processArgs" == e15) continue;
                    r += ` --window${e15.replace(/[A-Z]|^[a-z]/g, (e)=>"-" + e.toLowerCase()
                    )}=${o(t4[e15])}`;
                }
                t4 && t4.processArgs && (r += " " + t4.processArgs), Neutralino.os.execCommand(r, {
                    background: !0
                }).then((e)=>{
                    n3(e);
                }).catch((e)=>{
                    i(e);
                });
            });
        }
    });
    var y = Object.freeze({
        __proto__: null,
        broadcast: function(e, t) {
            return c1("events.broadcast", {
                event: e,
                data: t
            });
        },
        on: function(e, t) {
            return window.addEventListener(e, t), Promise.resolve({
                success: !0,
                message: "Event listener added"
            });
        },
        off: function(e, t) {
            return window.removeEventListener(e, t), Promise.resolve({
                success: !0,
                message: "Event listener removed"
            });
        },
        dispatch: n1
    });
    var E = Object.freeze({
        __proto__: null,
        dispatch: function(e16, n, i) {
            return new Promise((o, r)=>t1(this, void 0, void 0, function*() {
                    let t5 = yield Neutralino.extensions.getStats();
                    if (t5.loaded.includes(e16)) {
                        if (t5.connected.includes(e16)) try {
                            let t = yield c1("extensions.dispatch", {
                                extensionId: e16,
                                event: n,
                                data: i
                            });
                            o(t);
                        } catch (e17) {
                            r(e17);
                        }
                        else !function(e, t) {
                            e in s1 ? s1[e].push(t) : s1[e] = [
                                t
                            ];
                        }(e16, {
                            method: "extensions.dispatch",
                            data: {
                                extensionId: e16,
                                event: n,
                                data: i
                            },
                            resolve: o,
                            reject: r
                        });
                    } else r({
                        code: "NE_EX_EXTNOTL",
                        message: `${e16} is not loaded`
                    });
                })
            );
        },
        broadcast: function(e, t) {
            return c1("extensions.broadcast", {
                event: e,
                data: t
            });
        },
        getStats: function() {
            return c1("extensions.getStats");
        }
    });
    let O = null;
    var R = Object.freeze({
        __proto__: null,
        checkForUpdates: function(e19) {
            return new Promise((n, i)=>t1(this, void 0, void 0, function*() {
                    if (!e19) return i({
                        code: "NE_RT_NATRTER",
                        message: "Missing require parameter: url"
                    });
                    try {
                        let t = yield fetch(e19);
                        O = JSON.parse((yield t.text())), !function(e) {
                            return !!(e.applicationId && e.applicationId == window.NL_APPID && e.version && e.resourcesURL);
                        }(O) ? i({
                            code: "NE_UP_CUPDMER",
                            message: "Invalid update manifest or mismatching applicationId"
                        }) : n(O);
                    } catch (e) {
                        i({
                            code: "NE_UP_CUPDERR",
                            message: "Unable to fetch update manifest"
                        });
                    }
                })
            );
        },
        install: function(e20) {
            return new Promise((e, n4)=>t1(this, void 0, void 0, function*() {
                    if (!O) return n4({
                        code: "NE_UP_UPDNOUF",
                        message: "No update manifest loaded"
                    });
                    try {
                        let t = yield fetch(O.resourcesURL), n = yield t.arrayBuffer();
                        yield Neutralino.filesystem.writeBinaryFile(window.NL_PATH + "/resources.neu", n), e({
                            success: !0,
                            message: "Update installed. Restart the process to see updates"
                        });
                    } catch (e) {
                        n4({
                            code: "NE_UP_UPDINER",
                            message: "Update installation error"
                        });
                    }
                })
            );
        }
    });
    var b = Object.freeze({
        __proto__: null,
        readText: function(e, t) {
            return c1("clipboard.readText", {
                key: e,
                data: t
            });
        },
        writeText: function(e) {
            return c1("clipboard.writeText", {
                data: e
            });
        }
    });
    let T = !1;
    return e1.app = _, e1.clipboard = b, e1.computer = m, e1.debug = p, e1.events = y, e1.extensions = E, e1.filesystem = f, e1.init = function() {
        T || (a1(), window.NL_ARGS.find((e)=>"--neu-dev-auto-reload" == e
        ) && Neutralino.events.on("neuDev_reloadApp", ()=>t1(this, void 0, void 0, function*() {
                yield Neutralino.debug.log("Reloading the application..."), location.reload();
            })
        ), window.NL_CVERSION = "3.2.0", T = !0);
    }, e1.os = w, e1.storage = v, e1.updater = R, e1.window = h, Object.defineProperty(e1, "__esModule", {
        value: !0
    }), e1;
}({
});

//# sourceMappingURL=index.3b63e145.js.map
