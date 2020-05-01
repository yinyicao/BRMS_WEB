<!--这个页用来测试摄像头时创建的，无具体路由，保留此页仅仅是为了之后查询-->
<template>
  <div>
    <video id="video"
           width="400" height="400"
           style="border: 1px solid gray"
           ></video>


    <button @click="startScan">开始扫描</button>
    <button @click="stopScan">停止扫描</button>
  </div>
</template>
<script>
  import { BrowserMultiFormatReader } from '@zxing/library';
  let scan = null;
  export default {
    name:'qrcode',
    data() {
      return {
        firstDeviceId:''
      }
    },
    mounted() {
      // this.getCompetence();
      const that = this;
      that.codeReader = new BrowserMultiFormatReader();
      that.codeReader
        .listVideoInputDevices()
        .then(videoInputDevices => {
          // videoInputDevices.forEach(device =>
          //   console.log(`${device.label}, ${device.deviceId}`)
          //
          // );
          //只获取第一个设备
          that.firstDeviceId = videoInputDevices[0].deviceId;
          console.log(that.firstDeviceId)
        })
        .catch(err => console.error(err));

    },
    methods: {
      getCompetence () {
        var _this = this
        this.thisVideo = document.getElementById('videoCamera')
        // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {}
        }
        // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
        // 使用getUserMedia，因为它会覆盖现有的属性。
        // 这里，如果缺少getUserMedia属性，就添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            // 首先获取现存的getUserMedia(如果存在)
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia
            // 有些浏览器不支持，会返回错误信息
            // 保持接口一致
            if (!getUserMedia) {
              return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
            }
            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
            return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject)
            })
          }
        }
        var constraints = { audio: false, video: { width: this.videoWidth, height: this.videoHeight, transform: 'scaleX(-1)' } }
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
          // 旧的浏览器可能没有srcObject
          if ('srcObject' in _this.thisVideo) {
            _this.thisVideo.srcObject = stream
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream)
          }
          _this.thisVideo.onloadedmetadata = function (e) {
            _this.thisVideo.play()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      //开始扫描
      startScan() {
        const that = this;
        that.codeReader.decodeFromVideoDevice(that.firstDeviceId, 'video', (result, err) => {
          if (result) {
            console.log(result)
          }
          // if (err && !(err instanceof ZXing.NotFoundException)) {
          //   console.error(err)
          // }
        })

      },
      stopScan(){
        this.codeReader.reset()
      }
    },
  }
</script>
<style lang="scss">
  .scan {
    height: 100%;
    #bcid {
      width: 100%;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom:3rem;
      text-align: center;
      color: #fff;
      background: #ccc;
    }
    footer {
      position: absolute;
      left: 0;
      bottom: 1rem;
      height: 2rem;
      line-height: 2rem;
      z-index: 2;
    }
  }
</style>

