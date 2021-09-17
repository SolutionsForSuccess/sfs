<template>
    <div id="ProductForm" class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    
    <modal name="variants-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
    <ion-buttons slot="start" @click="hideVariant()">
            <ion-back-button default-href="home"></ion-back-button>
    </ion-buttons>
    <ion-header>
        <ion-toolbar>
        <ion-title>{{$t('backoffice.form.buttons.addChoice')}}</ion-title>          
        </ion-toolbar>
        
    </ion-header>

    <ion-card>  

        <ion-row>

            <ion-col size="12" size-md="6">                  
                <ion-card style="width: 50%;"> 
                    <label v-if="checkImage2()"> 
                        <img   :src="vf_file">
                        <input type="file" accept="image/png, image/jpeg" style="display:none"  @change="handleImage2" >
                    </label>
                    <label v-else>  {{ $t('backoffice.form.titles.imageText')}} 
                        <input type="file" accept="image/png, image/jpeg" style="display: block"  @change="handleImage2" >
                    </label>
                </ion-card>

                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
                    <ion-input type="text" name="vf_name"
                    @input="vf_name = $event.target.value" 
                    v-bind:value="vf_name">
                    </ion-input>
                </ion-item>

                <ion-item>
                    <ion-label position="floating">{{$t('backoffice.form.fields.description')}}</ion-label>
                    <ion-textarea name="vf_description" 
                    @input="vf_description = $event.target.value" 
                    v-bind:value="vf_description">
                    </ion-textarea>
                </ion-item>

                
            </ion-col>

            <ion-col size="12" size-md="6">
                    <ion-item>
                    <ion-label position="floating">Size</ion-label>
                    <ion-input type="text" name="vf_size"
                    @input="vf_size = $event.target.value" 
                    v-bind:value="vf_size">
                    </ion-input>
                </ion-item>

                <ion-item>
                    <ion-label position="floating">{{$t('backoffice.form.fields.costPrice')}}</ion-label>
                    <ion-input type="number" name="vf_costPrice"
                    @input="vf_costPrice = $event.target.value" 
                    v-bind:value="vf_costPrice">
                    </ion-input>
                </ion-item>

                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>Retail</ion-label>
                    <ion-input type="number" name="vf_salePrice"
                    @input="vf_salePrice = $event.target.value" 
                    v-bind:value="vf_salePrice">
                    </ion-input>
                </ion-item>

                 <ion-item>
                    <ion-label position="floating">{{$t('backoffice.form.fields.salePrice')}}</ion-label>
                    <ion-input type="number" name="vf_salePrice"
                    @input="vf_salePriceSale = $event.target.value" 
                    v-bind:value="vf_salePriceSale">
                    </ion-input>
                </ion-item>

                
                

                <ion-item>
                    <ion-label>{{$t('backoffice.form.fields.active')}}</ion-label>
                    <ion-checkbox slot="end" name="vf_active" 
                        @ionChange="vf_active = $event.target.checked"
                        :checked="vf_active" >    
                    </ion-checkbox>
                </ion-item>
            </ion-col>
        </ion-row>
        

            <ion-button  @click="hideVariant()">{{$t('backoffice.list.messages.buttons.cancel')}}</ion-button>
            <ion-button  :disabled="vf_name==='' ||  vf_salePrice <= 0 ? true : false" @click="save()">{{$t('backoffice.form.buttons.save')}}</ion-button>
            
        

    </ion-card>

            
    </modal>

    <modal name="side-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
    <ion-buttons slot="start" @click="hideSide()">
            <ion-back-button default-href="home"></ion-back-button>
    </ion-buttons>
    <ion-header>
        <ion-toolbar>
        <ion-title>{{$t('backoffice.form.buttons.addChoice')}}</ion-title>          
        </ion-toolbar>
        
    </ion-header>

    <ion-card>             

        <ion-item>
            <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.cantOfSides')}}</ion-label>
            <ion-input type="number" name="aggregatesCant"
            @input="aggregatesCant = $event.target.value" 
            v-bind:value="aggregatesCant">
            </ion-input>
        </ion-item>

            <ion-item>
                <ion-label>{{$t('backoffice.form.fields.categoryOfSides')}}</ion-label>
                <ion-select  interface="popover"
                @ionChange="aggregateCategoryId = changeAggregateCategory($event.target.value)" v-bind:value="aggregateCategoryId">
                    <ion-select-option v-for="category in categories" v-bind:key="category.Id" v-bind:value="category._id" >{{category.Name}}</ion-select-option>
                </ion-select>
            </ion-item>

            <div v-if="aggregateCategoryId != false">
                <!-- <div> -->
                    <h2>{{$t('backoffice.form.fields.availableProducts')}}</h2>
                    <div>
                        <ion-spinner v-if="spinner" name="lines" class="spinner"></ion-spinner>
                    </div>

                <ion-list class="content-list" style="margin: 0 15px;">
                        
                    <ion-item
                        v-for="(product, index) in productByCategory"
                        v-bind:key="index"                               
                    >
                        <ion-avatar >
                            <img :src="product.ImageUrl"  />
                        </ion-avatar>

                        <ion-label> 
                            <h2> <span style="padding: 0 10px">  {{ product.Name }} </span> {{ getFormateNumber(product.SalePrice) }}         </h2>    
                            <h3 style="padding: 0 10px">  {{getCategoryNameById(product.CategoryId)}} </h3>
                        </ion-label>

                        <ion-button
                            fill="clear"
                            shape="round"
                                color="secondary"
                            class="list-gourp-btn"
                            side="end"
                            @click.stop="addProduct(product)"
                            >
                                <ion-icon  slot="icon-only"  icon="add"  class="more-grid" ></ion-icon>
                        </ion-button>
                    </ion-item>
                </ion-list>

            </div>
            
            <ion-list class="content-list" v-if="aggregates.length > 0" style="margin: 0 15px;">
                
                <ion-item
                    v-for="(product, index) in aggregates"
                    v-bind:key="index"                               
                >
                    <ion-avatar >
                        <img :src="product.ImageUrl"  />
                    </ion-avatar>

                    <ion-label> 
                        <h2> <span style="padding: 0 10px">  {{ product.Name }} </span> {{ getFormateNumber(product.SalePrice) }}         </h2>    
                        <h3 style="padding: 0 10px">  {{getCategoryNameById(product.CategoryId)}} </h3>
                    </ion-label>

                    <ion-button
                        fill="clear"
                        shape="round"
                            color="secondary"
                        class="list-gourp-btn"
                        side="end"
                        @click.stop="delProduct(product)"
                        >
                            <ion-icon  slot="icon-only"  icon="trash"  class="more-grid" ></ion-icon>
                    </ion-button>
                </ion-item>
            </ion-list>

            <ion-button  @click="hideSide()">{{$t('backoffice.list.messages.buttons.cancel')}}</ion-button>
            <ion-button  @click="hideSide()">Ok</ion-button>

    </ion-card>

            
    </modal>

    <modal name="category-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="hideCategory()">
                <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>

        <ion-header>
            <ion-toolbar>
            <ion-title>{{$t('backoffice.form.titles.categoryNewTitle')}}</ion-title>          
            </ion-toolbar>        
        </ion-header>

        <ion-card>  
            <Categ 
            :externalProp="true" 
            :categTypeProp="cType"
            @reloadCategory="reloadCategory" />
        </ion-card>
    </modal>

     <modal name="tax-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="hideTax()">
                <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-header>
            <ion-toolbar>
            <ion-title>{{$t('backoffice.form.titles.taxNewTitle')}}</ion-title>          
            </ion-toolbar>        
        </ion-header>

        <ion-card>  
            <Tax 
                :externalProp="true"
                @reloadTax="reloadTax" />
        </ion-card>
    </modal>


    <ion-header>
          <ion-toolbar>
            <ion-item>
                <ion-buttons slot="start">
                <ion-back-button default-href="/controlPanel" @click="goToBack()">
                    </ion-back-button>
                </ion-buttons>
                <ion-label v-if="screenWidth < 600" style="padding: 20px 0px;">
                    <h1>{{title}}</h1>            
                </ion-label>
                <ion-label v-if="screenWidth >= 600" style="padding: 20px 35%;">
                    <h1>{{title}}</h1>            
                </ion-label>

            </ion-item>

        
          </ion-toolbar>
    </ion-header>
    <br/>

    <!-- <ion-card> -->
     <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
      ></ion-loading>
    <div >  

        <div >

            <ion-row>
                <ion-col size="12" size-md="6">

                    <ion-item>
                        <ion-label ><span style="color: red">*</span>{{$t('backoffice.form.fields.image')}}</ion-label>
                      
                    </ion-item>

                    <ion-card style="width: 50%;"> 
                        <label v-if="checkImage()"> 
                            <img   :src="file">
                            <input type="file" accept="image/png, image/jpeg" style="display:none"  @change="handleImage" >
                        </label>
                        <label v-else>  {{ $t('backoffice.form.titles.imageText')}} 
                            <input type="file" accept="image/png, image/jpeg" style="display:block"  @change="handleImage" >
                        </label>
                    </ion-card>

                    <ion-item>
                        <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
                        <ion-input type="text" name="name"
                        @input="name = $event.target.value" 
                        v-bind:value="name">
                        </ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label position="floating">{{$t('backoffice.form.fields.shortDescription')}}</ion-label>
                        <ion-input type="text" name="shortDescription"
                        @input="shortDescription = $event.target.value" 
                        v-bind:value="shortDescription">
                        </ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label position="floating">{{$t('backoffice.form.fields.description')}}</ion-label>
                        <ion-textarea name="description" 
                        @input="description = $event.target.value" 
                        v-bind:value="description"></ion-textarea>
                    </ion-item>

                    <ion-item v-if="cType == 'service'">
                        <ion-label>{{$t('backoffice.form.fields.showServicePrice')}}</ion-label>
                        <ion-checkbox slot="end" name="ShowServicePrice" 
                            @ionChange="showServicePrice = $event.target.checked"
                            :checked="showServicePrice"  >    
                        </ion-checkbox>
                    </ion-item>

                    <ion-item>
                        <ion-label position="floating">{{$t('backoffice.form.fields.costPrice')}}</ion-label>
                        <ion-input type="number" name="costPrice"
                        @input="costPrice = $event.target.value" 
                        v-bind:value="costPrice">
                        </ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label position="floating"><span style="color: red">*</span>Retail</ion-label>
                        <ion-input type="number" name="salePrice"
                        @input="salePrice = $event.target.value" 
                        v-bind:value="salePrice">
                        </ion-input>
                    </ion-item>

                      <ion-item>
                        <ion-label position="floating">{{$t('backoffice.form.fields.salePrice')}}</ion-label>
                        <ion-input type="number" name="salePrice"
                        @input="salePriceSale = $event.target.value" 
                        v-bind:value="salePriceSale">
                        </ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label>{{$t('backoffice.form.fields.available')}}</ion-label>
                        <ion-toggle slot="end" name="available" 
                            @ionChange="available = $event.target.checked"
                            :checked="available"  >    
                        </ion-toggle>
                    </ion-item>

                </ion-col>

                <ion-col size="12" size-md="6">

                
                    <ion-item v-if="specialPrice">
                        <ion-label>Special price: <span style="color: red">{{ specialPrice }}</span></ion-label>
                    </ion-item>

                    <ion-item v-if="cType == 'service'">
                        <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.stimateTime')}}</ion-label>
                        <ion-input type="number" name="stimateTime"
                        @input="stimateTime = $event.target.value" 
                        v-bind:value="stimateTime">
                        </ion-input>
                    </ion-item>

                    <ion-list>
                        <div style="display: flex;justify-content: space-between; align-items: center;">
                            <ion-label>
                                {{$t('backoffice.form.fields.tax')}}
                            </ion-label>
                                <ion-select   interface="popover"
                            @ionChange="taxId = $event.target.value" v-bind:value="taxId">
                                <ion-select-option :key="null" value="" >None</ion-select-option>
                                <ion-select-option v-for="tax in taxes" v-bind:key="tax.Id" v-bind:value="tax._id" >{{tax.Name}}</ion-select-option>
                            </ion-select>
                                <ion-label>
                                <ion-button
                                    fill="clear" 
                                    @click="showTax()"       
                                    >
                                    <ion-icon slot="icon-only" icon="add"></ion-icon>
                                </ion-button> 
                            </ion-label>
                        </div>
                    </ion-list>  
                    
                    <ion-list>
                        <div style="display: flex;justify-content: space-between; align-items: center;">
                            <ion-label>
                                <span style="color: red">*</span>{{$t('backoffice.form.fields.category')}}
                            </ion-label>
                            <div>
                                <ion-select  interface="popover"
                            @ionChange="categoryId = $event.target.value" v-bind:value="categoryId">
                                <ion-select-option v-for="category in categories" v-bind:key="category.Id" v-bind:value="category._id" >{{category.Name}}</ion-select-option>
                            </ion-select>
                            </div>
                            <ion-button
                                fill="clear" 
                                @click.stop="showCategory()"       
                                >
                                <ion-icon slot="icon-only" icon="add"></ion-icon>
                            </ion-button>    
                        </div>
                    </ion-list>

                    <div >  <!-- variants -->
                        <div style="display: flex;justify-content: space-between; align-items: center;">
                            <ion-label>{{$t('backoffice.form.titles.variants')}}</ion-label>
                            <ion-label>
                                <ion-button
                                    fill="clear" 
                                    @click="showVariant()"       
                                    >
                                    <ion-icon slot="icon-only" icon="add"></ion-icon>
                                </ion-button> 
                            </ion-label>
                            
                        </div>

                        <ion-list class="content-list" v-if="variantList.length > 0" style="margin: 0 15px;">
                            <ion-item
                                v-for="(variant,index) in variantList"
                                v-bind:key="index"                               
                            >
                                <ion-avatar >
                                    <img :src="variant.ImageUrl"  />
                                </ion-avatar>

                                <ion-label> 
                                    <span style="padding: 0 10px">  {{ variant.Name }} </span> {{ getFormateNumber(variant.SalePrice) }}             
                                </ion-label>

                                <ion-button
                                    fill="clear"
                                    color="secondary"
                                    shape="round"
                                    class="list-gourp-btn"
                                    side="end"
                                    @click.stop="editVariant(index, variant._id)"
                                    >
                                        <ion-icon  slot="icon-only"  icon="create"  class="more-grid" ></ion-icon>
                                </ion-button>
                                <ion-button
                                    fill="clear"
                                    shape="round"
                                        color="secondary"
                                    class="list-gourp-btn"
                                    side="end"
                                    @click.stop="deleteVariant(index)"
                                    >
                                        <ion-icon  slot="icon-only"  icon="trash"  class="more-grid" ></ion-icon>
                                </ion-button>
                            </ion-item>
                        </ion-list>                      
                    </div>

                    <div v-if="cType == 'product'">
                        <div style="display: flex;justify-content: space-between; align-items: center;" >                         
                            <ion-label>{{$t('backoffice.form.fields.haveSides')}} ( {{aggregatesCant}} {{$t('frontend.home.aggregateFree')}})</ion-label>                             
                                <ion-label>
                                <ion-button
                                    fill="clear" 
                                    @click="showSide()"       
                                    >
                                    <ion-icon slot="icon-only" icon="add"></ion-icon>
                                </ion-button> 
                            </ion-label>
                        </div>

                            <ion-list class="content-list" v-if="aggregates.length > 0" style="margin: 0 15px;">
                            
                            <ion-item
                                v-for="(product, index) in aggregates"
                                v-bind:key="index"                               
                            >
                                <ion-avatar >
                                    <img :src="product.ImageUrl"  />
                                </ion-avatar>

                                <ion-label> 
                                    <h2> <span style="padding: 0 10px">  {{ product.Name }} </span> {{ getFormateNumber(product.SalePrice) }}         </h2>    
                                    <h3 style="padding: 0 10px">  {{getCategoryNameById(product.CategoryId)}} </h3>
                                </ion-label>

                                <ion-button
                                    fill="clear"
                                    shape="round"
                                        color="secondary"
                                    class="list-gourp-btn"
                                    side="end"
                                    @click.stop="delProduct(product)"
                                    >
                                        <ion-icon  slot="icon-only"  icon="trash"  class="more-grid" ></ion-icon>
                                </ion-button>
                            </ion-item>
                        </ion-list>

                        

                    </div>   

                    <div v-if="cType == 'product'">

                        <div style="display: flex;justify-content: space-between; align-items: center;" >                         
                            <ion-label>{{$t('backoffice.form.titles.ingredients')}} </ion-label>  
                            <ion-input type="text" name="textIngredient" placeholder="type Ingedient..."
                                @input="textIngredient = $event.target.value" 
                                v-bind:value="textIngredient">
                            </ion-input>                            
                                <ion-label>
                            
                                <ion-button
                                    fill="clear" 
                                    @click="addIngredient()"    
                                    :disabled="textIngredient != ''? false : true"                                  
                                    >
                                    <ion-icon slot="icon-only" icon="add"></ion-icon>
                                </ion-button> 
                            </ion-label>
                        </div>

                        <ion-list class="content-list" v-if="ingredients.length > 0" style="margin: 0 15px;">
                            
                            <ion-item
                                v-for="(ingredient, index) in ingredients"
                                v-bind:key="index"                               
                            >
                                <ion-label> 
                                    <h2> <span style="padding: 0 10px">  {{ ingredient.name }} </span>   </h2>    
                                </ion-label>

                                <ion-button
                                    fill="clear"
                                    shape="round"
                                        color="secondary"
                                    class="list-gourp-btn"
                                    side="end"
                                    @click.stop="removeIngredient(ingredient)"
                                    >
                                        <ion-icon  slot="icon-only"  icon="trash"  class="more-grid" ></ion-icon>
                                </ion-button>
                            </ion-item>
                        </ion-list>

                    </div>                 

                

                </ion-col>

                <ion-button @click="segmentMore=!segmentMore">More Info</ion-button>

               
            </ion-row>

             <ion-row  v-if="cType == 'product' && segmentMore" >

                 <ion-col size="12" size-md="6">

                       <ion-item>
                            <ion-label position="floating">SKU</ion-label>
                            <ion-input type="text" name="sku"
                            @input="sku = $event.target.value" 
                            v-bind:value="sku">
                            </ion-input>
                        </ion-item>

                        <ion-item>
                            <ion-label position="floating">{{$t('frontend.reservation.code')}}</ion-label>
                            <ion-input type="text" name="code"
                            @input="code = $event.target.value" 
                            v-bind:value="code">
                            </ion-input>
                        </ion-item>

                        <ion-item>
                            <ion-label position="floating">{{$t('backoffice.form.fields.stockQuantity')}}</ion-label>
                            <ion-input type="number" name="stockQuantity"
                            @input="stockQuantity = $event.target.value" 
                            v-bind:value="stockQuantity">
                            </ion-input>
                        </ion-item>

                        <ion-item>
                            <ion-label position="floating">{{$t('backoffice.form.fields.minReorderPoint')}}</ion-label>
                            <ion-input type="number" name="minReorderPoint"
                            @input="minReorderPoint = $event.target.value" 
                            v-bind:value="minReorderPoint">
                            </ion-input>
                        </ion-item>

                        <ion-item>
                            <ion-label position="floating">{{$t('backoffice.form.fields.maxReorderPoint')}}</ion-label>
                            <ion-input type="number" name="maxReorderPoint"
                            @input="maxReorderPoint = $event.target.value" 
                            v-bind:value="maxReorderPoint">
                            </ion-input>
                        </ion-item>

                        <ion-item>
                            <ion-label position="floating">{{$t('backoffice.form.fields.vendorName')}}</ion-label>
                            <ion-input type="text" name="vendorName"
                            @input="vendorName = $event.target.value" 
                            v-bind:value="vendorName">
                            </ion-input>
                        </ion-item>

                 </ion-col>

                 <ion-col size="12" size-md="6">

                            <ion-item>
                <ion-label position="floating">{{$t('backoffice.form.fields.vendorCode')}}</ion-label>
                <ion-input type="text" name="vendorCode"
                @input="vendorCode = $event.target.value" 
                v-bind:value="vendorCode">
                </ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">{{$t('backoffice.form.fields.keywords')}}</ion-label>
                <ion-input type="text" name="keywords"
                @input="keywords = $event.target.value" 
                v-bind:value="keywords">
                </ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">{{$t('backoffice.form.fields.tags')}}</ion-label>
                <ion-input type="text" name="tags"
                @input="tags = $event.target.value" 
                v-bind:value="tags">
                </ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">{{$t('backoffice.form.fields.binNumber')}}</ion-label>
                <ion-input type="text" name="binNumber"
                @input="binNumber = $event.target.value" 
                v-bind:value="binNumber">
                </ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">{{$t('backoffice.form.fields.addSerialNumber')}}</ion-label>
                <ion-input type="text" name="addSerialNumber"
                @input="addSerialNumber = $event.target.value" 
                v-bind:value="addSerialNumber">
                </ion-input>
            </ion-item>
                 </ion-col>

            </ion-row>
            

            <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveProduct()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
        </div>


    
    

      

    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
// import QrcodeVue from 'qrcode.vue';
import Categ from './CategoryForm.vue'
import Tax from './TaxForm.vue'

export default {

  name: 'pruductForm',
   
  data () {
    return {
      modelName: 'Product',
       /****** Form Data ******/
      id: null,
      name: '',
      sku: '',
      code: '',
      description: '',
      barCode: "",
      costPrice: 0,
      salePrice: 0,
      salePriceSale: 0,
      specialPrice: null,
      stimateTime: 0,

      stockQuantity: 0,
      minReorderPoint: 0,
      maxReorderPoint: 0,

      vendorName: '',
      vendorCode: '',
      shortDescription: '',
      addSerialNumber: '',
      tags: '',
      keywords: '',
      binNumber: '',


      available: false,
      epos: null,

      showServicePrice: false,

      categoryId: null,
      categories: [],

      taxId: null,
      taxes: [],

    //   variantGroupId: null,
    //   variantGroups: [],

      sourceCategoryId: null,
      sourceMenuId: null,

      //Sides
      addAgregates: false,
      aggregateCategoryId : false,
      productByCategory: [],
      aggregatesCant: 0,
      aggregates : [],

      //Ingredients List
      addIngredients: false,
      textIngredient: '',
      ingredients: [],

      file: null,
      fileName: '',
      qr: '',

      cType: '',

      isBackdrop: false,
      spinner: false,

      //Segment
      segmentMore: false,
      general: true,
      others: false,
      variants: false,
      sides: false,
      ingredientsB: false,
      categoryTab: false,

      //screenwidth
      screenWidth: 0,

      //Variant
      addVariant: false,
      vf_id: -1,
      vf_name: '',
      vf_description: '',
      vf_size: '',
      vf_costPrice: 0,
      vf_salePrice: 0,
      vf_salePriceSale: 0,
      vf_active: false,
      vf_file: null,
      vf_fileName: '',
      vf_qr: '',
      variantGroupId: null,
      variantList: [],

      //Current list page
      currentPageOrder: 1,
      currency: 'USD'
      
    }
  },
//   components: {
//       QrcodeVue,
//   },
  created: function(){
      this.init();
  },
  components:{
      Categ, Tax
  },
  computed: {
        title() {
            if (this.cType != 'product')
                return this.id ? this.$t('backoffice.form.titles.serviceEditTitle') :  this.$t('backoffice.form.titles.serviceNewTitle');
            else
                return this.id ? this.$t('backoffice.form.titles.productEditTitle') :  this.$t('backoffice.form.titles.productNewTitle');
        }
  },
  methods: {

   

    clearForm(){
        this.addVariant = false
        this.vf_id = -1
        if(this.vf_name) this.vf_name = ''
        if(this.vf_description) this.vf_description = ''
        if(this.vf_size) this.vf_size = ''
        if(this.vf_costPrice) this.vf_costPrice = 0
        if(this.vf_salePrice) this.vf_salePrice = 0
        if(this.stimateTime) this.stimateTime=0
        if(this.vf_active) this.vf_active = false
        if(this.vf_file) this.vf_file = null
        if(this.vf_fileName) this.vf_fileName = ''
        // document.getElementById('variantImg').value = ''
        if(this.vf_qr) this.vf_qr = ''
    },

    isValidVariantForm(){
        let errors = [];
        if (this.vf_name == "")
        {
            errors.push(this.$t('backoffice.form.validate.name'));
        }
        if (this.vf_file == null)
        {
            errors.push(this.$t('backoffice.form.validate.image'));
        }        
        if (isNaN(this.vf_salePrice))
        {
            errors.push(this.$t('backoffice.form.validate.salePriceNumber'));
        }       
        if (this.vf_salePrice == 0)
        {
            errors.push(this.$t('backoffice.form.validate.salePriceGreater'));
        }

        if (errors.length > 0)
        {
            let message = "";
            for (let i = 0; i < errors.length; i++) {
                 message += (i + 1) + "- " + errors[i] + "<br/>";
            }
            // this.ShowMessage(this.$t('backoffice.form.validate.validate'),
            //                    message, this.$t('backoffice.form.validate.validateVariantGroup')); // Traducciones
            this.showToastMessage(message, "danger");
            return false;
        }
        else
        {
            return true;
        }
    },

    save(){
        if (this.isValidVariantForm())
        {
            let item = {
                "Name": this.vf_name,
                "Description": this.vf_description,
                "CostPrice": this.vf_costPrice,
                "SalePrice": this.vf_salePrice,
                "Size": this.vf_size,
                "Active": this.vf_active,
            }
            if (this.vf_file != null)
            {
                item["ImageUrl"] = this.vf_file;
                item["ImageName"] = this.vf_fileName;
            }

            if (this.vf_id != -1) // Editing
            {
                const index = this.variantList.findIndex(v => v._id == this.vf_id)
                if(index !== -1){
                    this.variantList[index].Name = item.Name;
                    this.variantList[index].Description = item.Description;
                    this.variantList[index].CostPrice = item.CostPrice;
                    this.variantList[index].SalePrice = item.SalePrice;
                    this.variantList[index].Size = item.Size;
                    this.variantList[index].Active = item.Active;

                    if (item.ImageUrl){
                        this.variantList[index].ImageUrl = item.ImageUrl;
                        this.variantList[index].ImageName = item.ImageName;
                    }
                    this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessVariant'), "success");

                    }
                
            }
            else{ // Create
                this.variantList.push(item)
                this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessVariant'), "success");
            }

            this.clearForm();
            this.hideVariant();
        }
        
    },

    deleteVariant(pos){
        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteVariantGroup'), 
        buttons: [
          {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: this.$t('backoffice.list.messages.buttons.delete'),
            handler: () => {

                this.variantList.splice(pos, 1);
                this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessVariant'), "success");
            }
          }
        ]
      })
      .then(a => a.present());
    },

    editVariant(index, id){
        this.addVariant = true
        this.vf_id = id
        this.vf_name = this.variantList[index].Name
        this.vf_description = this.variantList[index].Description
        this.vf_size = this.variantList[index].Size
        this.vf_costPrice = this.variantList[index].CostPrice
        this.vf_salePrice = this.variantList[index].SalePrice
        this.vf_active = this.variantList[index].Active

        if (this.variantList[index].ImageUrl){
            this.vf_file = this.variantList[index].ImageUrl
            this.vf_fileName = this.variantList[index].ImageName
        }
        this.showVariant();
        
        this.vf_qr = ''
    },

    reloadTax(newTaxId){
        this.taxes =  this.$store.state.backConfig.tax;
         this.taxId = newTaxId;
         this.hideTax();
    },

    reloadCategory(newCatId){
        this.fetchCategories();
         this.categoryId = newCatId;
         this.hideCategory();
    },

    init(){
        this.currentPageOrder = this.$route.params.currentPageOrder;
        this.screenWidth = screen.width;
        this.id = this.$route.params.productId;
        this.sourceCategoryId = this.$route.params.categoryId;
        this.sourceMenuId = this.$route.params.menuId;
        this.cType = this.$route.params.type || 'product';
        this.currency = this.$store.state.backConfig.restaurant.Currency;

        this.fetchCategories();
        this.taxes =  this.$store.state.backConfig.tax;
        
        if (this.id){
            const data = this.$store.state.backConfig.product.find(p=> p._id === this.id)
           if(data){
                this.name = data.Name;
            this.sku = data.Sku;
            this.code = data.Code;
            this.description = data.Description;
            this.costPrice = data.CostPrice;
            this.salePrice = data.SalePrice;
            this.specialPrice = data.SpecialPrice;
            this.stockQuantity = data.StockQuantity;
            this.minReorderPoint = data.MinReorderPoint,
            this.maxReorderPoint = data.MaxReorderPoint,

            this.vendorName = data.VendorName;
            this.vendorCode = data.VendorCode;
            this.shortDescription = data.ShortDescription,

            this.addSerialNumber = data.AddSerialNumber,
            this.tags = data.Tags,
            this.keywords = data.Keywords,
            this.binNumber = data.BinNumber,

            this.categoryId = data.CategoryId;
            this.taxId = data.TaxId;
            this.barCode = data.BarCode;
            this.file = data.ImageUrl;
            this.available = data.Available;
           
            if (data.VariantGroupId)
            {
                this.variantGroupId = data.VariantGroupId;
                const obrVariant = this.$store.state.backConfig.variantgroup.find(v => v._id === data.VariantGroupId)
                if(obrVariant)
                    this.variantList = obrVariant.Variants;
            }
                
            this.qr = data._id;
            if (this.cType == 'service'){
                this.showServicePrice = data.ShowServicePrice;
                this.stimateTime = data.StimateTime;
            }

                
            this.ingredients = data.Ingredients;                       
            if (this.ingredients.length > 0)
                this.addIngredients = true;
            this.aggregatesCant = data.AggregateCant || 0;                      
            this.fetchAggregatesObj(data.Aggregates)
            if(data.Aggregates.length > 0)
                this.addAgregates = true                           
            this.epos = data.EposId;
           }
        
        }
    },

    goToBack(){
        if (this.sourceMenuId != null)
        {
            this.$router.push({
                            name: 'ProductByCategory',
                            params: {
                                categoryId: this.categoryId,
                                menuId: this.sourceMenuId
                            }
                        })
        }
        else{
            this.$router.push({ 
                name: 'Product',
                params: {
                    type: this.cType,
                    currentPageOrder: this.currentPageOrder,
                }
            })
        }
    },

    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.$t('backoffice.list.messages.buttons.goToList'),
              handler: () => {
                  this.$router.push({
                      name: 'Product',
                      params: {
                          type: this.cType
                      }
                  });
              }
            },
            {
              text: this.$t('backoffice.list.messages.buttons.retry'),
              handler: () => {
                  action();
              }
            }
          ]
        })
        .then(a => a.present());
    },

    isValidForm(){
        // let errors = [];
        if (this.name == "")
        {
            // errors.push(this.$t('backoffice.form.validate.name'));
            return false
        }       
        if (isNaN(this.salePrice))
        {
            // errors.push(this.$t('backoffice.form.validate.salePriceNumber'));
            return false
        }      
        if (this.salePrice == 0)
        {
            // errors.push(this.$t('backoffice.form.validate.salePriceGreater'));
            return false
        }
        if (this.categoryId == null)
        {
            // errors.push(this.$t('backoffice.form.validate.category'));
            return false
        }
        // if (this.file == null)
        // {
        //     // errors.push(this.$t('backoffice.form.validate.image'));
        //     return false
        // }
        if (this.cType == 'service' && this.stimateTime <= 0)
        {
            return false
        }

        return true

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'), message,
        //     //                    this.$t('backoffice.form.validate.validateProduct'));
        //     this.showToastMessage(message, "danger");
        //     return false;
        // }
        // else
        // {
        //     return true;
        // }
    },

    addIngredient(){
        if (this.textIngredient != "" && 
                !this.ingredients.find(i => i.name == this.textIngredient))
        {
            this.ingredients.push({ 'name': this.textIngredient, 'selected': 1})
            this.textIngredient = ""
        }
        else{
          this.ShowMessage(this.$t('backoffice.form.validate.validate'), '', this.$t('backoffice.form.validate.ingredient'))
        }      
    },

    removeIngredient(index){
        this.ingredients.splice(index, 1);
    }, 

    async changeAggregateCategory(value){
        this.aggregateCategoryId = value

        this.spinner = true
        await Api.getProductsByCategory(this.aggregateCategoryId)
        .then(response => {
            this.productByCategory = response.data
            this.updateSelectedProduct()
            this.spinner = false
        })
        .catch(e => {
           e
            this.spinner = false
        })  
    },

    fetchAggregatesObj(aggregateIds){
       let productAggregates = this.$store.state.backConfig.product
        aggregateIds.forEach(aggId => {
            const agg = productAggregates.filter(aggregate => aggregate._id == aggId)
            agg.forEach(a => {
            this.aggregates.push(a)
            })
        })
    },

    updateSelectedProduct(){
        this.aggregates.forEach(aggregate => {
            this.productByCategory = this.productByCategory.filter(product => product._id != aggregate._id) 
        })
    },

    restoreProduct(product){
        this.productByCategory.push(product);
    },

    addProduct(product){
        let index = this.aggregates.indexOf(product);
        if (index == -1)
        {
            this.aggregates.push(product);
        }
        this.updateSelectedProduct();
    },

    delProduct(product){
        let index = this.aggregates.indexOf(product);
        this.aggregates.splice(index, 1);
        this.restoreProduct(product);
    },

    getCategoryNameById: function(id){
        var categ = '';
        this.categories.forEach(category => {
            if (category._id == id) {
                categ = category.Name;                
            }
        });
        return categ;
    },

    ShowMessage(type, message, topic='') {
        return this.$ionic.alertController
          .create({
            cssClass: 'my-custom-class',
            header: type,
            subHeader: topic,
            message: message,
            buttons: [this.$t('backoffice.form.messages.buttons.ok')],
          })
        .then(a => a.present())
    },

    showToastMessage(message, tColor){
       return this.$ionic.toastController.create({
        color: tColor,
        position: 'top',
        duration: 3000,
        message: message,
        showCloseButton: false
      }).then(a => a.present())
    },

    /****** Load image use base64 encode esto debería ir en un componente******/
    checkImage: function(){
      return this.file != null;
    },
    handleImage: function(event)
    {
        const selectedImage = event.target.files[0];
        this.fileName = selectedImage.name;
        this.createBase64Img(selectedImage);
    },

    createBase64Img: function(fileObject){
        const reader = new FileReader();

        reader.onload = (e) => {
            this.file = e.target.result;
        };
        reader.readAsDataURL(fileObject);
    },

    checkImage2: function(){
      return this.vf_file != null;
    },

    handleImage2: function(event)
    {
        const selectedImage = event.target.files[0];
        this.vf_fileName = selectedImage.name;
        this.createBase64Img2(selectedImage);
    },

    createBase64Img2: function(fileObject){
        const reader = new FileReader();

        reader.onload = (e) => {
            this.vf_file = e.target.result;
        };
        reader.readAsDataURL(fileObject);
    },

    /*******          Fin           *******/
    fetchCategories: function(){
         
          this.categories = this.$store.state.backConfig.category;
          if (this.cType === 'product')
              this.categories = this.categories.filter(cat => !cat.Service || cat.Service == false)
          else
              this.categories = this.categories.filter(cat => cat.Service == true)

    },
   
    saveProduct: async function(){

        if (this.isValidForm())
        {
            this.isBackdrop = true;
            let item = {
            "Name": this.name,
            "Sku": this.sku,
            "Code": this.code,
            "Description": this.description,
            "CostPrice": this.costPrice,
            "SalePrice": this.salePrice,
            "StockQuantity": this.stockQuantity,
            "MinReorderPoint": this.minReorderPoint,
            "MaxReorderPoint": this.maxReorderPoint,
            "VendorName": this.vendorName,
            "VendorCode": this.vendorCode,
            "ShortDescription": this.shortDescription,

            "AddSerialNumber": this.addSerialNumber,
            "Tags": this.tags,
            "Keywords": this.keywords,
            "BinNumber": this.binNumber,

            "CategoryId": this.categoryId,
            "TaxId": this.taxId,
            "ImageUrl": "",
            "Available": this.available,
            "BarCode": "",
            "AggregateCant": 0,
            "Aggregates": [],
            "Ingredients": [],
            "VariantGroupId": null
            }
            if (this.file != null)
            {
              item["ImageUrl"] = this.file;
              item["ImageName"] = this.fileName;
            }
            // if(this.variantGroupId){
            //     item["VariantGroupId"] = this.variantGroupId;
            // }
            if (this.aggregates.length > 0)
            {
                  item["AggregateCant"] = this.aggregatesCant;

                  let aggregatesList = [];
                  this.aggregates.forEach(aggregate => {
                      aggregatesList.push(aggregate._id)
                  });
                  item["Aggregates"] = aggregatesList;
            }
            if (this.ingredients.length > 0)
            {
                item["Ingredients"] = this.ingredients;
            }
            if (this.cType == 'service')
            {
                item["ShowServicePrice"] = this.showServicePrice;
                item["StimateTime"] = this.stimateTime;
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              item['BarCode'] = this.id;
              if (this.epos)
              {
                  item["EposId"] = this.epos;
              }
              this.spinner = true;
           
              if (this.variantList.length > 0)
              {
                  let itemVG = {
                    "Name": this.name,
                    "Description": this.description,
                    "Variants": this.variantList,
                    }
                  if (this.variantGroupId)
                  {
                      itemVG["_id"] = this.variantGroupId
                      const v = await Api.putIn('VariantGroup', itemVG)
                     
                      if (v.status == 200 && v.statusText === "OK")
                      {
                          item["VariantGroupId"] = this.variantGroupId
                          this.putInProduct(item)
                          const index = this.$store.state.backConfig.variantgroup.findIndex(v => v._id === this.variantGroupId)
                          if(index !== -1) this.$store.state.backConfig.variantgroup[index] = itemVG
                          
                      }
                        
                  }
                  else{
                      Api.postIn('VariantGroup', itemVG)
                      .then(response => {
                          item["VariantGroupId"] = response.data._id
                          this.putInProduct(item)
                         this.$store.state.backConfig.variantgroup.push(response.data)
                         
                          
                      })
                  }
              }
              else
              {
                  if (this.variantGroupId){
                      item["VariantGroupId"] = null
                      Api.deleteById('VariantGroup', this.variantGroupId)
                      const index = this.$store.state.backConfig.variantgroup.findIndex(v => v._id === this.variantGroupId)
                      if(index !== -1) this.$store.state.backConfig.variantgroup.splice(index, 1);
                          
                  }
                  this.putInProduct(item)
              }

            }
            else{
              //Else, I am created a new category
              this.spinner = true;

              //VariantGroup
              
              //VariantGroup
              
              if (this.variantList.length > 0)
              {
                  let itemVG = {
                    "Name": this.name,
                    "Description": this.description,
                    "Variants": this.variantList,
                    }
                  if (this.variantGroupId)
                  {
                      itemVG["_id"] = this.variantGroupId
                      Api.putIn('variantGroup', itemVG)
                      this.postInProduct(item)
                      const index = this.$store.state.backConfig.variantgroup.findIndex(v => v._id === this.variantGroupId)
                          if(index !== -1) this.$store.state.backConfig.variantgroup[index] = itemVG
                          
                  }
                  else{
                      Api.postIn('variantGroup', itemVG)
                      .then(response => {
                          item["VariantGroupId"] = response.data._id
                          this.postInProduct(item);                         
                          this.$store.state.backConfig.variantgroup.push(response.data)                          
                      })
                  }
              }
              else
              {
                  if (this.variantGroupId){
                      item["VariantGroupId"] = null
                      Api.deleteById('variantGroup', this.variantGroupId)
                      const index = this.$store.state.backConfig.variantgroup.findIndex(v => v._id === this.variantGroupId)
                    if(index !== -1) this.$store.state.backConfig.variantgroup.splice(index ,1)
                          
                  }
                  this.postInProduct(item)
              }
            }
        }   
    },

    async postInProduct(item){
        await Api.postIn(this.modelName, item)
        .then(response => {         
            this.$store.state.backConfig.product.push(response.data);
            this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessProduct'), "success");
            this.name = '';
            this.sku = '';
            this.code = '';
            this.description = '';
            this.salePrice = 0;
            this.costPrice = 0;
            this.stimateTime = 0;
            this.stockQuantity = 0;
            this.maxReorderPoint = 0;
            this.vendorName = '';
            this.vendorCode = '';
            this.shortDescription = '';
            this.addSerialNumber = '';
            this.tags = '';
            this.keywords = '';
            this.binNumber = '';
            this.minReorderPoint = 0;
            this.categoryId = null;
            this.taxId = null;
            this.file = null;
            this.barCode = '';
            this.available = false;
            this.spinner = false;

            if (this.sourceMenuId != null){
                this.$router.push({
                    name: 'ProductByCategory',
                    params: {
                        categoryId: this.categoryId,
                        menuId: this.sourceMenuId
                    }
                });
            }
            else{
                this.$router.push({
                    name: 'Product',
                    params: {
                        type: this.cType
                    } 
                });
            }

            return response;
        })
        .catch(e => {
            this.isBackdrop = false;
            e;
            this.spinner = false;
            this.ifErrorOccured(this.saveProduct);
        })
    },

    putInProduct(item){
        Api.putIn(this.modelName, item)
        .then(response => {            
            const index = this.$store.state.backConfig.product.findIndex(p => p._id === item._id);
            if(index !== -1) this.$store.state.backConfig.product[index] = item;
            this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessProduct'), "success");
            this.name = '';
            this.sku = '';
            this.code = '';
            this.description = '';
            this.salePrice = 0;
            this.costPrice = 0;
            this.stimateTime = 0;
            this.stackQuantity = 0;
            this.maxReorderPoint = 0;
            this.vendorName = '';
            this.vendorCode = '';
            this.shortDescription = '';
            this.addSerialNumber = '';
            this.tags = '';
            this.keywords = '';
            this.binNumber = '';
            this.minReorderPoint = 0;
            this.categoryId = null;
            this.taxId = null;
            this.file = null;
            this.barCode = '';
            this.available = false;
            this.spinner = false;

            if (this.sourceMenuId != null){
                this.$router.push({
                    name: 'ProductByCategory',
                    params: {
                        categoryId: this.categoryId,
                        menuId: this.sourceMenuId
                    }
                });
            }
            else{
                this.$router.push({
                    name: 'Product',
                    params: {
                        type: this.cType
                    }
                });
            }

            
            return response;
        })
        .catch(e => {
            this.isBackdrop = false;
            e;
            this.spinner = false;
            this.ifErrorOccured(this.saveProduct);
        })
    },

    backToProductList: function(){
        if (this.sourceCategoryId && this.sourceMenuId)
        {
            this.$router.push({
                name: 'ProductByCategory', 
                params: {
                          categoryId: this.sourceCategoryId,
                          menuId: this.sourceMenuId,
                        }
            });
        }
        else{
            this.$router.push({
              name: 'Product',
              params: {
                  type: this.cType
              } 
            });
        }
    },

       
    showVariant () {
      this.$modal.show('variants-modal');
        },
    
    hideVariant () {
      this.$modal.hide('variants-modal');
        },

     showSide () {
      this.$modal.show('side-modal');
        },
    
    hideSide () {
      this.$modal.hide('side-modal');
        },

    showCategory () {
      this.$modal.show('category-modal');
        },
    
    hideCategory () {
      this.$modal.hide('category-modal');
        },

    showTax () {
      this.$modal.show('tax-modal');
        },
    
    hideTax () {
      this.$modal.hide('tax-modal');
        },

        

        
    getFormateNumber: function(number){
      return new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(number).toString()
    },
   
  },

}
    
</script>
<style>

.spinner {
    
    display: inline-block;
    position: relative;
    width: 70px;
    height: 70px;
    color: var(--color);
    user-select: none;
}

div.aggregates{

  margin-left: 5%;
  margin-right: 5%;

}

@media only screen and (min-width : 1024px){

    .screen{
        padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px;
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>