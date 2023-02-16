<template>
  <div class="calculator-page">
    <div class="detail">
      <div class="left-box">文件上传：</div>
      <input type="file" @change="onChange($event)" />
      <div class="detail-item"></div>
      <div class="detail-button" @click="exportExcel()">输出</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { read, utils, writeFile } from "xlsx";
import moment from "moment";

interface ExcelItem {
  name: string;
  materialArr: Array<object>;
}

export default class Calculator extends Vue {
  tableData = [];
  tableHead = [];
  // 上传的excel文件处理过之后的excel数据
  excelChangeArr: ExcelItem[] = [];

  mounted() {
    console.log();
  }

  onChange(e: any) {
    const file = e.target.files[0] as Blob;
    const fileReader = new FileReader();

    fileReader.onload = (ev: any) => {
      try {
        const data = ev.target.result;
        const workbook: any = read(data, { type: "binary" });
        const params: any = [];
        // 取对应表生成json表格内容
        workbook.SheetNames.forEach((item: any) => {
          params.push({
            name: item,
            dataList: utils.sheet_to_json(workbook.Sheets[item], {
              defval: " "
            })
          });
          this.tableData.push(
            utils.sheet_to_json(workbook.Sheets[item], {
              defval: " "
            }) as never
          );
        });
        this.excelChangeArr = this.dealExcelData(params[0].dataList);
        // 该算法仅针对表头无合并的情况
        if (this.tableData.length > 0) {
          // 获取excel中第一个表格数据tableData[0][0]，并且将表头提取出来
          let key: any = [];
          for (key in this.tableData[0][0]) {
            this.tableHead.push(key as never);
          }
        }
        return params;
        // 重写数据
      } catch (e) {
        console.log("error:" + e);
        return false;
      }
    };
    fileReader.readAsBinaryString(file);
  }

  // 处理上传的文件数据
  dealExcelData(dataList: any): ExcelItem[] {
    // 删除数组最后一位多余数据
    dataList.pop();
    // 处理过后的excel数据
    let excelArr: ExcelItem[] = [];
    for (let itemIndex in dataList) {
      let temp = 0;
      if (Object.prototype.hasOwnProperty.call(dataList[itemIndex], "进厂日期")) {
        dataList[itemIndex]["进厂日期"] = moment("1900/01/01")
          .add(moment.duration({ days: dataList[itemIndex]["进厂日期"] - 2 }))
          .format("YYYY/MM/DD");
      }
      if (Object.prototype.hasOwnProperty.call(dataList[itemIndex], "时间")) {
        // dataList[itemIndex]["时间"] = moment("1900/01/01")
        //   .add(moment.duration({ days: dataList[itemIndex]["时间"] - 2 }))
        //   .format("YYYY/MM/DD");
      }
      for (let nameObjIndex in excelArr) {
        if (
          (excelArr[nameObjIndex].name as string) ==
          dataList[itemIndex]["物料名称"]
        ) {
          excelArr[nameObjIndex].materialArr.push(dataList[itemIndex]);
          temp = 1;
          break;
        }
      }
      if (temp == 0) {
        excelArr.push({
          name: dataList[itemIndex]["物料名称"],
          materialArr: [dataList[itemIndex]]
        });
      }
    }
    return excelArr;
  }

  // 输出excel
  exportExcel() {
    let new_workbook = utils.book_new();
    for (let execlItemIndex in this.excelChangeArr) {
      let workSheetHead = utils.aoa_to_sheet([this.tableHead]);
      let workSheet = utils.sheet_add_json(
        workSheetHead,
        this.excelChangeArr[execlItemIndex].materialArr,
        { skipHeader: true, origin: "A2" }
      );
      utils.book_append_sheet(
        new_workbook,
        workSheet,
        this.excelChangeArr[execlItemIndex].name
      );
    }
    writeFile(new_workbook, "文件" + ".xlsx");
  }
}
</script>
<style scoped lang="scss">
@import "./calculator.scss";
</style>
