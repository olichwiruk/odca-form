<template>
    <div class="controlItem form-group" :class="control.className">
        <component :is="controlInstance" :control="control" :isValid="isValid" :label-position="labelPosition">
            <template v-slot:label>
                <div class="col-md-4">
                    <label :class="{ pii: control.isPII }"> {{ control.label }} </label>
                    <span v-show="control.required">*</span>
                </div>
            </template>
            <template v-slot:errors>
                <div class="invalid-feedback">{{ errors }}</div>
            </template>

            <template v-slot:information>
                <div class="col-md-1" />
                <div class="col-md-11 information">
                  {{ control.information }}
                </div>
            </template>
        </component>
    </div>
</template>

<script>
    import {Hooks} from '@/gui/components/hook_lists';
    import {CONTROL_TYPES} from "@/config/control_constant";

    export default {
        name: "ControlComponent",
        props: ['control', 'labelPosition'],
        data: () => ({
            controlInstance: null,
            isValid: true
        }),
        computed: {
            errors() {
                return this.control.errors ? this.control.errors.join(',') : ""
            }
        },
        watch: {
          'control.errors': {
            handler() {
              this.isValid = !(this.control.errors && this.control.errors.length > 0)
            },
            deep: true
          }
        },
        created() {
            if (!CONTROL_TYPES[this.control.type]) {
                console.error(`Control type ${this.control.type} doesn't exist to render.`);
                return;
            }

            Hooks.Control.beforeRegister.run(this.control);

            // set control
            this.controlInstance = CONTROL_TYPES[this.control.type].source.gui;
        },
        mounted() {
            Hooks.Control.afterRegister.run(this.control);
        }
    }
</script>

<style scoped>
    .information {
      text-align: justify;
      font-style: italic;
      color: #6a6a6a;
    }

    .pii {
      font-weight: 600;
    }
</style>
