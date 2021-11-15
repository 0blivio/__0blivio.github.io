var Main=pc.createScript("main");Main.attributes.add("playerPrefab",{type:"asset"}),Main.attributes.add("entitiesNode",{type:"entity"}),Main.prototype.initialize=function(){const t=this.app;t.socket=io.connect("https://viridian-spectacular-dryer.glitch.me");const e=t.socket;t.players={},t.localPlayer={},t.input={},this.tmpVec3_1=new pc.Vec3,this.tmpQuat_1=new pc.Quat,e.on("connect",(()=>{e.on("playersIn",(i=>{for(const t in i){let e=this.playerPrefab.resource.instantiate();e.setPosition(i[t].position.x,i[t].position.y,i[t].position.z),e.name=t,this.entitiesNode.addChild(e)}t.localPlayer=this.entitiesNode.findByName(e.id)})),e.on("playerJoined",(t=>{if(t==e.id)return;let i=this.playerPrefab.resource.instantiate();i.name=t,this.entitiesNode.addChild(i)})),e.on("playerLeft",(t=>{this.entitiesNode.findByName(t).destroy()})),e.on("playerMoved",(t=>{for(const i in t)i!=e.id&&(this.tmpVec3_1.x=t[i].position.x,this.tmpVec3_1.y=t[i].position.y,this.tmpVec3_1.z=t[i].position.z,this.entitiesNode.findByName(i).findByName("Player").rigidbody.teleport(this.tmpVec3_1),this.tmpQuat_1.x=t[i].rotation.x,this.tmpQuat_1.y=t[i].rotation.y,this.tmpQuat_1.z=t[i].rotation.z,this.tmpQuat_1.w=t[i].rotation.w,this.entitiesNode.findByName(i).findByName("Ghost").setLocalRotation(this.tmpQuat_1),this.entitiesNode.findByName(i).findByName("Ghost").findByName("PlayerName").element.text=t[i].nick)})),t.loop=setInterval((()=>{if(!Object.keys(t.localPlayer).length)return;let i={position:t.localPlayer.findByName("Player").position,rotation:t.localPlayer.findByName("Ghost").localRotation};e.emit("movePlayer",i)}),50)})),t.keyboard.on("keydown",(e=>{e.event.repeat||"w"!=e.event.key&&"a"!=e.event.key&&"s"!=e.event.key&&"d"!=e.event.key||(t.input[e.event.key]=!0)})),t.keyboard.on("keyup",(e=>{"w"!=e.event.key&&"a"!=e.event.key&&"s"!=e.event.key&&"d"!=e.event.key||(t.input[e.event.key]=!1)}))},Main.prototype.update=function(t){this.app};var Network=pc.createScript("network");Network.prototype.initialize=function(){},Network.prototype.update=function(t){};var Client=pc.createScript("client");Client.prototype.initialize=function(){this.entity.rigidbody.mask=11},Client.prototype.fixedUpdate=function(i){const t=this.app;let e={...t.input},n=t.physicsTicks,p=new pc.Vec3;for(const i in e)e[i]&&("w"==i&&(p.z-=1),"a"==i&&(p.x-=1),"s"==i&&(p.z+=1),"d"==i&&(p.x+=1));p.normalize().mulScalar(20),this.entity.rigidbody.applyForce(p),this.entity.rigidbody.applyForce(0,-9.8,0),t.inputs.push({id:n,keys:e})};var Server=pc.createScript("server");Server.prototype.initialize=function(){this.entity.rigidbody.mask=10,this.lastProcessedId=0},Server.prototype.fixedUpdate=function(s){const e=this.app;if(!e.serverInputs.find((s=>s.id>this.lastProcessedId&&s.id<this.lastProcessedId+2)))return;e.physicsTicks;let i=e.serverInputs.find((s=>s.id>this.lastProcessedId&&s.id<this.lastProcessedId+2)),t=e.inputs.findIndex((s=>s.id==this.lastProcessedId));e.inputs.splice(0,t);let r=new pc.Vec3;for(const s in i.keys)i.keys[s]&&("w"==s&&(r.z-=1),"a"==s&&(r.x-=1),"s"==s&&(r.z+=1),"d"==s&&(r.x+=1));r.normalize().mulScalar(20),this.entity.rigidbody.applyForce(r),this.entity.rigidbody.applyForce(0,-9.8,0),this.lastProcessedId=i.id};var LerpGhost=pc.createScript("lerpGhost");LerpGhost.attributes.add("playerEntity",{type:"entity"}),LerpGhost.prototype.initialize=function(){const t=this.app;this.entity.parent.name==t.socket.id&&(this.entity.findByName("PlayerModel").findByName("Alpha_Surface").render.enabled=!1,this.entity.findByName("PlayerModel").findByName("Alpha_Joints").render.enabled=!1),this.tmpVec3_1=new pc.Vec3},LerpGhost.prototype.update=function(t){this.entity.getPosition().distance(this.playerEntity.getPosition())>.01?this.entity.findByName("PlayerModel").anim.setBoolean("Walking",!0):this.entity.findByName("PlayerModel").anim.setBoolean("Walking",!1),this.entity.setPosition(this.tmpVec3_1.lerp(this.entity.getPosition(),this.playerEntity.getPosition(),.1))};var PlayerMovement=pc.createScript("playerMovement");PlayerMovement.attributes.add("camera",{type:"entity"}),PlayerMovement.prototype.initialize=function(){this.force=new pc.Vec3},PlayerMovement.prototype.update=function(e){const t=this.app;if(this.entity.parent.name!=t.localPlayer.name)return;let r=this.camera.forward,i=this.camera.right,a=0,n=0;for(const e in t.input)t.input[e]&&("w"==e&&(a+=r.x,n+=r.z),"a"==e&&(a-=i.x,n-=i.z),"s"==e&&(a-=r.x,n-=r.z),"d"==e&&(a+=i.x,n+=i.z));this.force.set(a,0,n).normalize().scale(10.5),this.entity.rigidbody.applyForce(this.force),this.force.sub(this.force)};var CameraLook=pc.createScript("cameraLook");CameraLook.prototype.initialize=function(){const e=this.app;this.eulers=new pc.Vec3,this.lookSpeed=.1,this.entity.parent.parent.name!=e.socket.id&&(this.entity.enabled=!1),e.mouse.on("mousemove",this._onMouseMove,this),e.mouse.on("mousedown",(function(){e.mouse.enablePointerLock()}),this)},CameraLook.prototype.update=function(e){const t=this.app;this.entity.parent.parent.name==t.socket.id&&(this.entity.setLocalEulerAngles(this.eulers.y,0,0),this.entity.parent.setLocalEulerAngles(0,this.eulers.x,0))},CameraLook.prototype._onMouseMove=function(e){(pc.Mouse.isPointerLocked()||e.buttons[0])&&(this.eulers.x-=this.lookSpeed*e.dx,this.eulers.y=pc.math.clamp(this.eulers.y-this.lookSpeed*e.dy,-90,90))};pc.extend(pc,function(){function computeGaussian(e,t){return 1/Math.sqrt(2*Math.PI*t)*Math.exp(-e*e/(2*t*t))}function calculateBlurValues(e,t,s,o,r){e[0]=computeGaussian(0,r),t[0]=0,t[1]=0;var i,a,l=e[0];for(i=0,a=Math.floor(7.5);i<a;i++){var u=computeGaussian(i+1,r);e[2*i]=u,e[2*i+1]=u,l+=2*u;var h=2*i+1.5;t[4*i]=s*h,t[4*i+1]=o*h,t[4*i+2]=-s*h,t[4*i+3]=-o*h}for(i=0,a=e.length;i<a;i++)e[i]/=l}var BloomEffect=function(e){var t={aPosition:pc.SEMANTIC_POSITION},s=["attribute vec2 aPosition;","","varying vec2 vUv0;","","void main(void)","{","    gl_Position = vec4(aPosition, 0.0, 1.0);","    vUv0 = (aPosition + 1.0) * 0.5;","}"].join("\n"),o=["precision "+e.precision+" float;","","varying vec2 vUv0;","","uniform sampler2D uBaseTexture;","uniform float uBloomThreshold;","","void main(void)","{","    vec4 color = texture2D(uBaseTexture, vUv0);","","    gl_FragColor = clamp((color - uBloomThreshold) / (1.0 - uBloomThreshold), 0.0, 1.0);","}"].join("\n"),r=["precision "+e.precision+" float;","","#define SAMPLE_COUNT 15","","varying vec2 vUv0;","","uniform sampler2D uBloomTexture;","uniform vec2 uBlurOffsets[SAMPLE_COUNT];","uniform float uBlurWeights[SAMPLE_COUNT];","","void main(void)","{","    vec4 color = vec4(0.0);","    for (int i = 0; i < SAMPLE_COUNT; i++)","    {","        color += texture2D(uBloomTexture, vUv0 + uBlurOffsets[i]) * uBlurWeights[i];","    }","","    gl_FragColor = color;","}"].join("\n"),i=["precision "+e.precision+" float;","","varying vec2 vUv0;","","uniform float uBloomEffectIntensity;","uniform sampler2D uBaseTexture;","uniform sampler2D uBloomTexture;","","void main(void)","{","    vec4 bloom = texture2D(uBloomTexture, vUv0) * uBloomEffectIntensity;","    vec4 base = texture2D(uBaseTexture, vUv0);","","    base *= (1.0 - clamp(bloom, 0.0, 1.0));","","    gl_FragColor = base + bloom;","}"].join("\n");this.extractShader=new pc.Shader(e,{attributes:t,vshader:s,fshader:o}),this.blurShader=new pc.Shader(e,{attributes:t,vshader:s,fshader:r}),this.combineShader=new pc.Shader(e,{attributes:t,vshader:s,fshader:i});var a=e.width,l=e.height;this.targets=[];for(var u=0;u<2;u++){var h=new pc.Texture(e,{format:pc.PIXELFORMAT_R8_G8_B8_A8,width:a>>1,height:l>>1});h.minFilter=pc.FILTER_LINEAR,h.magFilter=pc.FILTER_LINEAR,h.addressU=pc.ADDRESS_CLAMP_TO_EDGE,h.addressV=pc.ADDRESS_CLAMP_TO_EDGE;var n=new pc.RenderTarget(e,h,{depth:!1});this.targets.push(n)}this.bloomThreshold=.25,this.blurAmount=4,this.bloomIntensity=1.25,this.sampleWeights=new Float32Array(15),this.sampleOffsets=new Float32Array(30)};return(BloomEffect=pc.inherits(BloomEffect,pc.PostEffect)).prototype=pc.extend(BloomEffect.prototype,{render:function(e,t,s){var o=this.device,r=o.scope;r.resolve("uBloomThreshold").setValue(this.bloomThreshold),r.resolve("uBaseTexture").setValue(e.colorBuffer),pc.drawFullscreenQuad(o,this.targets[0],this.vertexBuffer,this.extractShader),calculateBlurValues(this.sampleWeights,this.sampleOffsets,1/this.targets[1].width,0,this.blurAmount),r.resolve("uBlurWeights[0]").setValue(this.sampleWeights),r.resolve("uBlurOffsets[0]").setValue(this.sampleOffsets),r.resolve("uBloomTexture").setValue(this.targets[0].colorBuffer),pc.drawFullscreenQuad(o,this.targets[1],this.vertexBuffer,this.blurShader),calculateBlurValues(this.sampleWeights,this.sampleOffsets,0,1/this.targets[0].height,this.blurAmount),r.resolve("uBlurWeights[0]").setValue(this.sampleWeights),r.resolve("uBlurOffsets[0]").setValue(this.sampleOffsets),r.resolve("uBloomTexture").setValue(this.targets[1].colorBuffer),pc.drawFullscreenQuad(o,this.targets[0],this.vertexBuffer,this.blurShader),r.resolve("uBloomEffectIntensity").setValue(this.bloomIntensity),r.resolve("uBloomTexture").setValue(this.targets[0].colorBuffer),r.resolve("uBaseTexture").setValue(e.colorBuffer),pc.drawFullscreenQuad(o,t,this.vertexBuffer,this.combineShader,s)}}),{BloomEffect:BloomEffect}}());var Bloom=pc.createScript("bloom");Bloom.attributes.add("bloomIntensity",{type:"number",default:1,min:0,title:"Intensity"}),Bloom.attributes.add("bloomThreshold",{type:"number",default:.25,min:0,max:1,precision:2,title:"Threshold"}),Bloom.attributes.add("blurAmount",{type:"number",default:4,min:1,title:"Blur amount"}),Bloom.prototype.initialize=function(){this.effect=new pc.BloomEffect(this.app.graphicsDevice),this.effect.bloomThreshold=this.bloomThreshold,this.effect.blurAmount=this.blurAmount,this.effect.bloomIntensity=this.bloomIntensity;var e=this.entity.camera.postEffects;e.addEffect(this.effect),this.on("attr",(function(e,t){this.effect[e]=t}),this),this.on("state",(function(t){t?e.addEffect(this.effect):e.removeEffect(this.effect)})),this.on("destroy",(function(){e.removeEffect(this.effect)}))};var NameLookAt=pc.createScript("nameLookAt");NameLookAt.prototype.initialize=function(){},NameLookAt.prototype.update=function(t){const o=this.app;this.entity.lookAt(o.localPlayer.findByName("Ghost").findByName("Camera").getPosition()),this.entity.rotateLocal(0,180,0)};var Chat=pc.createScript("chat");Chat.prototype.initialize=function(){const t=this.app;this.typing=!1,this.default="Press 'Enter' to type.",this.name="",this.chatBoxPreset=this.entity.parent.findByName("ChatBox"),t.keyboard.on("keydown",(e=>{if(!e.event.repeat)if("Enter"==e.event.key){if(this.typing)if(this.entity.element.text.startsWith("/nickname ")){let e=this.entity.element.text.slice(10,25);this.entity.parent.parent.parent.findByName("Nickname").element.text=e,this.name=e,t.socket.emit("changeNick",e),this.entity.element.text=this.default}else this.chatBoxPreset.element.text=`${this.name}: ${this.entity.element.text} \n`,this.chatBoxPreset.setPosition(this.chatBoxPreset.getPosition().x,this.chatBoxPreset.getPosition().y+.5,this.chatBoxPreset.getPosition().z),this.parent.addChild(this.chatBoxPreset),this.entity.element.text=this.default;else this.entity.element.text="";this.typing=!this.typing}else this.typing&&1==e.event.key.length?this.entity.element.text+=e.event.key:"Backspace"==e.event.key&&(this.entity.element.text=this.entity.element.text.slice(0,this.entity.element.text.length-1))}))},Chat.prototype.update=function(t){};var TypeBox=pc.createScript("typeBox");TypeBox.attributes.add("chatBox",{type:"entity"}),TypeBox.attributes.add("messagePrefab",{type:"asset"}),TypeBox.prototype.initialize=function(){const e=this.app;let t="Press 'Enter' to type";this.isTyping=!1,this.entity.parent.parent.parent.parent.name==e.socket.id?(e.keyboard.on("keydown",(n=>{if(!n.event.repeat)if("Enter"==n.event.key)if(this.isTyping){this.isTyping=!this.isTyping;let n=this.entity.element.text;if(n.startsWith("/nickname ")){n=n.slice(0,n.length-1),this.entity.parent.parent.parent.findByName("PlayerName").element.text=n.slice(10,25);let i=this.entity.parent.parent.parent.findByName("PlayerName").element.text;e.socket.emit("changeNick",i),this.entity.element.text=t}else{let i=this.messagePrefab.resource.instantiate();i.element.text=n.slice(0,n.length-1),i.findByName("Nickname").element.text=this.entity.parent.parent.parent.findByName("PlayerName").element.text+": ",this.chatBox.addChild(i),e.socket.emit("message",{message:i.element.text,nickname:this.entity.parent.parent.parent.findByName("PlayerName").element.text}),this.entity.element.text=t}}else this.isTyping=!this.isTyping,this.entity.element.text="|";else if("Backspace"==n.event.key&&this.isTyping){let e=this.entity.element.text;this.entity.element.text=e.slice(0,e.length-2)+"|"}else if(1==n.event.key.length&&this.isTyping){let e=this.entity.element.text;this.entity.element.text=e.slice(0,e.length-1)+n.event.key+"|"}})),e.socket.on("message",(e=>{if(e.nickname==this.entity.parent.parent.parent.findByName("PlayerName").element.text)return;let t=this.messagePrefab.resource.instantiate();t.element.text=e.message,t.findByName("Nickname").element.text=e.nickname+": ",this.chatBox.addChild(t)}))):console.log("stopped")},TypeBox.prototype.update=function(e){};var SendMessage=pc.createScript("sendMessage");SendMessage.prototype.initialize=function(){this.app.keyboard.on("keydown",(()=>{console.log(this.entity.element),this.entity.element.text+="Shadowslie: Hi\nPannocchia: we\n"}))},SendMessage.prototype.update=function(e){};var VideoTexture=pc.createScript("videoTexture");VideoTexture.attributes.add("video",{title:"Video",description:"MP4 video asset to play back on this video texture.",type:"asset"}),VideoTexture.attributes.add("playEvent",{title:"Play Event",description:"Event that is fired as soon as the video texture is ready to play.",type:"string",default:""}),VideoTexture.attributes.add("screenMaterial",{title:"Screen Material",description:"The screen material of the TV that displays the video texture.",type:"asset",assetType:"material"}),VideoTexture.prototype.initialize=function(){var e=this.app,t=document.createElement("video");t.loop=!0,t.muted=!0,t.playsInline=!0,t.crossOrigin="anonymous";var i=t.style;i.width="1px",i.height="1px",i.position="absolute",i.opacity="0",i.zIndex="-1000",i.pointerEvents="none",document.body.appendChild(t),this.videoTexture=new pc.Texture(e.graphicsDevice,{format:pc.PIXELFORMAT_R8_G8_B8,minFilter:pc.FILTER_LINEAR_MIPMAP_LINEAR,magFilter:pc.FILTER_LINEAR,addressU:pc.ADDRESS_CLAMP_TO_EDGE,addressV:pc.ADDRESS_CLAMP_TO_EDGE,mipmaps:!0}),this.videoTexture.setSource(t),t.addEventListener("canplaythrough",function(i){e.fire(this.playEvent,this.videoTexture),t.play()}.bind(this)),t.src=this.video?this.video.getFileUrl():this.videoUrl,document.body.appendChild(t),t.load(),this.app.on(this.playEvent,(function(e){var t=this.screenMaterial.resource;t.emissiveMap=e,t.update()}),this)},VideoTexture.prototype.update=function(e){this.videoTexture.upload()};