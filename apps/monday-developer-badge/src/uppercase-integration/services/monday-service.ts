import initMondayClient from 'monday-sdk-js';

class MondayService {
  static async getColumnValue(token, itemId, columnId) {
    try {
      const mondayClient = initMondayClient({ token });

      const query = `query($itemId: [Int], $columnId: [String]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            text
          }
        }
      }`;
      const variables = { columnId, itemId };

      const response = await mondayClient.api(query, { variables });

      return (response.data as any).items[0].column_values[0].text;
    } catch (err) {
      console.log(err);
    }
  }

  static async changeColumnValue(token, boardId, itemId, columnId, value) {
    try {
      const mondayClient = initMondayClient({ token });

      const response = await mondayClient.api(`mutation {
        change_simple_column_value(board_id: ${boardId}, item_id: ${itemId}, column_id: "${columnId}", value: "${value}") {
          id
        }
      }`);
      console.log(response)
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}

export default MondayService;
