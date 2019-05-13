<template>
<div class="row p-2">
  <div class="col-sm-4" style="border-right : 2px solid #ccc">
    <div id="title">
      <h3>Liste des fichiers</h3>
    </div>
    <div id="search" class="p-1">
       <input type="text" class="form-control" placeholder="Recherche">
    </div>
    <div class="d-flex p-1">
      <button class="btn btn-outline-warning btn-sm col-1 mr-1" :disabled="!this.canReturn" @click="goUp"><font-awesome-icon icon="arrow-left" /></button>
        <button class="btn btn-outline-success btn-sm col-1 mr-1"><font-awesome-icon icon="upload" /></button>
         <button class="btn btn-outline-primary btn-sm col-1 mr-1" @click="this.getFiles"><font-awesome-icon icon="sync" /></button>
    </div>
    <div id="filesList" class="p-1">
        <table class="table table-bordered">
        <tr v-for="file in files" :key="file.id" @dblclick="fileDblClicked(file.id,file.file,file.parent,file.path)"><td>  <font-awesome-icon :icon=" file.file == 1 ? 'image':'folder'" /> {{ file.name }}</td></tr>

    </table>
    </div>
  
  </div>
  <div class="col-sm-8">
     <h3>File Name</h3>
    <div id="dwv">
    <div class="layerContainer" style="width:100% !important;">
        <canvas class="imageLayer" style="width:100%;height: 500px;"></canvas>
    </div>
</div>
  </div>
</div>
</template>

<script>
// import
import Vue from 'vue'
import dwv from 'dwv'
import axios from 'axios'
// import tagsTable from './tags-table'


// gui overrides

// decode query
dwv.utils.decodeQuery = dwv.utils.base.decodeQuery
// progress
dwv.gui.displayProgress = function () {}
// get element
dwv.gui.getElement = dwv.gui.base.getElement
// refresh element
dwv.gui.refreshElement = dwv.gui.base.refreshElement

// Image decoders (for web workers)
dwv.image.decoderScripts = {
  'jpeg2000': 'assets/dwv/decoders/pdfjs/decode-jpeg2000.js',
  'jpeg-lossless': 'assets/dwv/decoders/rii-mango/decode-jpegloss.js',
  'jpeg-baseline': 'assets/dwv/decoders/pdfjs/decode-jpegbaseline.js'
}

export default {
  name: 'dwv',
  components: {
    // tagsTable
  },
  data: function () {
    return {
      versions: {
        dwv: dwv.getVersion(),
        vue: Vue.version
      },
      dwvApp: null,
      tools: ['Scroll', 'ZoomAndPan', 'WindowLevel', 'Draw'],
      selectedTool: 'Select Tool',
      loadProgress: 0,
      dataLoaded: false,
      tags: null,
      showDicomTags: false,
      currentRoot : 0,
      prevRoot : -1,
      files : [],
    }
  },
  created (){
    this.getFiles();
  },
  mounted () {
    // create app
    this.dwvApp = new dwv.App()
    // initialise app
    this.dwvApp.init({
      'containerDivId': 'dwv',
      'tools': this.tools,
      'shapes': ['Ruler'],
      'isMobile': true
    })

    // this.dwvApp.loadURLs(["http://192.168.1.3:8000/dwv/root/test.dcm"]);

    // this.dwvApp.loadURLs(["https://raw.githubusercontent.com/ivmartel/dwv/master/tests/data/bbmri-53323851.dcm"]);
   
  },
  computed : {
    canReturn : function(){
      if(this.prevRoot == -1){
        return false;
      }
      return true;
    }
  },
  methods: {
    getFiles : function(){
      axios.get('http://192.168.1.3:8000/api/files/' + this.currentRoot).then(response => {
        this.files = response.data;
      });
    },
    fileDblClicked : function(fileid,filetype,parentid,path){
     
      if(filetype == 0){
        this.prevRoot = parentid;
        this.currentRoot = fileid;
        this.getFiles();
      }else if(filetype == 1){
        this.dwvApp.loadURLs([path]);
      }
     
    },
    goUp : function(){
        this.currentRoot = this.prevRoot;
        this.getCurrentParent();
        this.getFiles();
    },
    getCurrentParent : function(){
      axios.get('http://192.168.1.3:8000/api/current/parent/' + this.currentRoot).then(response =>{
        this.prevRoot = response.data;
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
tr, td {
  cursor: pointer;
}
tr:hover{
  border : 2px solid #20619e;
}
</style>
