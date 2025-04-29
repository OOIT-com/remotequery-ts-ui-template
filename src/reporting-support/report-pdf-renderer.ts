import { DocumentDef, isDSumCell } from './report-types';
import { GetLabelFun } from '../ui-factory';
import moment from 'moment';
import { Content, ContentTable, TableLayout, TDocumentDefinitions } from 'pdfmake/interfaces';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export function reportPdfRenderer(documentDef: DocumentDef, L: GetLabelFun) {
  const title = documentDef.title || L(documentDef);
  const footerMiddle = documentDef.footerMiddle ?? '';
  const filename = documentDef.filename || 'report';
  const logoBase64Url = documentDef.logoBase64Url;

  const parameter_layout: TableLayout = {
    hLineWidth: function () {
      return 0;
    },
    vLineWidth: function () {
      return 0;
    },
    hLineColor: function () {
      return '#888';
    },
    vLineColor: function () {
      return '#888';
    },
    paddingLeft: function () {
      return 4;
    },
    paddingRight: function () {
      return 4;
    },
    paddingTop: function () {
      return 2;
    },
    paddingBottom: function () {
      return 2;
    },
    fillColor: function () {
      return 'white';
    }
  };

  const table_layout: TableLayout = {
    hLineWidth: function () {
      return 0.5;
    },
    vLineWidth: function () {
      return 0.5;
    },
    hLineColor: function () {
      return '#444';
    },
    vLineColor: function () {
      return '#444';
    },
    paddingLeft: function () {
      return 2;
    },
    paddingRight: function () {
      return 2;
    },
    paddingTop: function () {
      return 2;
    },
    paddingBottom: function () {
      return 2;
    },
    fillColor: function (i: number) {
      return i === 0 ? '#CCCCCC' : null;
    }
  };

  const content: Content[] = [];
  const docDefinition: TDocumentDefinitions = {
    content,

    pageSize: documentDef.pageSize || 'A4',
    pageOrientation: documentDef.layout || 'portrait',
    pageMargins: [40, 60, 40, 60],

    footer: function (currentPage: any, pageCount: number) {
      return {
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              {
                text: currentPage.toString() + ' of ' + pageCount,
                italics: true,
                margin: [40, 20, 2, 0],
                alignment: 'left',
                fontSize: 9
              },
              {
                text: footerMiddle,
                italics: true,
                margin: [2, 20, 2, 0],
                alignment: 'center',
                fontSize: 9
              },
              {
                text: moment().format('LL'),
                italics: true,
                margin: [2, 20, 40, 0],
                alignment: 'right',
                fontSize: 9
              }
            ]
          ]
        },
        layout: 'noBorders'
      };
    },

    styles: {
      header: {
        fontSize: 22,
        bold: true
      },
      info: {
        italics: true,
        alignment: 'center'
      }
    }
  };

  // list title

  content.push({
    table: {
      widths: ['*', 140],
      body: [
        [
          {
            text: title,
            fontSize: 20,
            margin: [-5, 20, 0, 20],
            border: [false, false, false, false],
            color: '#666'
          },
          logoBase64Url
            ? {
                image: logoBase64Url,
                margin: [0, 0, -10, 20],
                width: 80,
                border: [false, false, false, false]
              }
            : {
                text: '',
                margin: [0, 0, -10, 20],
                width: 80,
                border: [false, false, false, false]
              }
        ]
      ]
    }
  });

  documentDef.parts.forEach((part) => {
    let widthSum = 0;

    // title

    if (part.title) {
      content.push({
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: part.title,
                fontSize: 14,
                margin: [0, 20, 0, 20],
                border: [false, false, false, false],
                color: '#666'
              }
            ]
          ]
        }
      });
    }

    // request

    if (part.dRequest) {
      const parameters: any[] = [];
      // _addDParameter(parameters, L('serviceId'), part.dRequest?.dServiceId);
      part.dRequest.dParameters.forEach((p) => {
        _addDParameter(parameters, p.label || '', p.value || '');
      });

      if (parameters.length > 0) {
        content.push({
          //headerRows: 0,
          table: {
            widths: [100, '*'],
            body: parameters
          },
          margin: [4, 0, 0, 20],
          layout: parameter_layout
        });
      }
    }

    // data

    if (!part.dData) {
      content.push({
        text: L('result-table-has-no-content'),
        style: 'info'
      });
    } else {
      const table: ContentTable = {
        table: {
          headerRows: 1,
          widths: [],
          body: [[]]
        },
        margin: [0, 0, 0, 20],
        layout: table_layout
      };
      content.push(table);

      //
      // header row
      //

      part.dData.header.forEach((head) => {
        table.table.body[0].push({
          text: head.label,
          bold: true,
          fontSize: 8
        });

        widthSum += head.width || 100;
      });

      table.table.widths = part.dData.header.map((head) => {
        return (100 * (head.width || 100)) / widthSum + '%';
      });

      //
      // body rows
      //

      part.dData.table.forEach((row) => {
        const r: Content[] = [];
        table.table.body.push(r);
        row.forEach((e) => {
          r.push({
            text: e.formatted,
            alignment: e.align || 'left',
            fontSize: 8,
            bold: isDSumCell(e)
          });
        });
      });
    }
  });

  pdfMake.createPdf(docDefinition).download(filename + '.pdf');

  function _addDParameter(list: Content[], label: string, value: string) {
    if (value !== undefined) {
      list.push([
        {
          text: label,
          bold: true,
          alignment: 'left',
          fontSize: 8
        },
        {
          text: value,
          alignment: 'left',
          fontSize: 8
        }
      ]);
    }
  }
}
