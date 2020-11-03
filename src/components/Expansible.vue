<template>
    <div>

        <v-expansion-panels  v-if="this.collection.size!=0" >
           
          <v-expansion-panel
            v-for="element in this.collection" :key="element[1].code" >
            <v-expansion-panel-header>
              {{element[1].code}} - {{element[1].name}} 
            
            </v-expansion-panel-header>
            <v-expansion-panel-content  >
              
                <Expansible :collection="element[1].content"/>
                <div v-if="element[1].content.keys().next().done">
                    {{element[1].name}}
                </div>
                



               


            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>


    </div>
</template>

<script>
  export default {
    name: 'Expansible',

    data: () => ({
      
    }),
    props:['collection', 'level'],
    methods:{
        
    }
   
  }
</script>
