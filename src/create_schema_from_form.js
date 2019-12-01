import * as odcaPkg from 'odca'
const odca = odcaPkg.com.thehumancolossuslab.odca
import Kotlin from 'kotlin'
var HashMap_init = Kotlin.kotlin.collections.HashMap_init_q3lmfv$;
import { TYPE_MAPPER } from './config/constants'
import { get_schemas } from './persistence'

const facade = new odca.Facade()

export const createSchemaFromForm = (form) => {
    const baseInfo = HashMap_init()
    const attributes = []

    const baseForm = get_schemas().find(s => s.uuid == form.uuid);
    if (!baseForm) {
        throw "Form cannot be exported"
    }
    baseInfo.put_xwzc9p$("name", baseForm.name)
    baseInfo.put_xwzc9p$("description", baseForm.description)
    baseInfo.put_xwzc9p$("classification", baseForm.classification)

    const attrNames = form.section.row.controls.map(c => c.attrName)
    const duplicates = attrNames.filter((attrName, index) => {
        return attrNames.indexOf(attrName) != index;
    })
    if (duplicates.length > 0) {
        duplicates.forEach(attrName => {
            throw `Attribute name '${attrName}' is duplicated`
        })
    }

    form.section.row.controls.forEach(control => {
        if (control.attrName.length <= 0) {
          throw "Attibute name cannot be empty"
        }

        const entry = (control.dataOptions &&
          control.dataOptions.length > 0) ?
          control.dataOptions.map(o => o.text) : null

        attributes.push(
          new odca.AttributeDto(
            control.attrName,
            TYPE_MAPPER.inputType[control.type],
            control.isPII,
            control.label,
            control.dateFormat,
            entry,
            control.encoding,
            control.information,
          )
        )
    })

    return facade.renderSchema(baseInfo, attributes)
}
