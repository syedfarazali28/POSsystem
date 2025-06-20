using ManagementPortalApp.Models.Authentication;
using System.Data;

namespace ManagementPortalApp.Extensions
{
    public class CommonMethods
    {
        public List<T> ConvertToList<T>(DataTable dt)
        {
            var columnNames = dt.Columns.Cast<DataColumn>().Select(c => c.ColumnName.ToLower()).ToList();
            var properties = typeof(T).GetProperties();
            return dt.AsEnumerable().Select(row => {
                var objT = Activator.CreateInstance<T>();
                foreach (var pro in properties)
                {
                    if (columnNames.Contains(pro.Name.ToLower()))
                    {
                        try
                        {
                            if (row[pro.Name].GetType() != typeof(System.DBNull))
                            {
                                pro.SetValue(objT, row[pro.Name]);
                            }
                        }
                        catch (Exception ex)
                        {
                            var e = ex.Message;
                        }
                    }
                }
                return objT;
            }).ToList();
        }
        public DataTable ConvertCsvToDataTable(string filePath)
        {
            DataTable dataTable = new DataTable();
            bool isFirstRow = true;

            using (var streamReader = new StreamReader(filePath))
            {
                while (!streamReader.EndOfStream)
                {
                    var line = streamReader.ReadLine();
                    var values = line.Split(',');

                    if (isFirstRow)
                    {
                        foreach (var value in values)
                        {
                            dataTable.Columns.Add(value);
                        }

                        DataColumn dataColumn2 = new DataColumn("Sequence", typeof(int));
                        dataColumn2.AutoIncrement = true;
                        dataColumn2.AutoIncrementSeed = 1;
                        dataColumn2.AutoIncrementStep = 1;
                        dataTable.Columns.Add(dataColumn2);
                        
                        isFirstRow = false;
                    }
                    else
                    {
                        DataRow row = dataTable.NewRow();
                        for (int i = 0; i < values.Length; i++)
                        {
                            // Check for empty or null values
                            if (!string.IsNullOrEmpty(values[i]))
                            {
                                if (dataTable.Columns[i].ColumnName == "Date")
                                {
                                    // Convert and format the date column
                                    DateTime date;
                                    if (DateTime.TryParse(values[i], out date))
                                        row[i] = date.ToString("yyyy-MM-dd");
                                    else
                                        row[i] = DBNull.Value;
                                }
                                if (dataTable.Columns[i].ColumnName == "DateTime")
                                {
                                    // Convert and format the date column
                                    DateTime date;
                                    if (DateTime.TryParse(values[i], out date))
                                        row[i] = date.ToString("yyyy-MM-dd HH:mm:ss");
                                    else
                                        row[i] = DBNull.Value;
                                }
                                else
                                {
                                    row[i] = values[i];
                                }
                            }
                            else
                            {
                                row[i] = DBNull.Value; // Set DBNull for empty values
                            }
                        }
                        dataTable.Rows.Add(row);
                    }
                }
            }

            return dataTable;
        }

        public List<Form> CreateObject(List<Navigation> navigation)
        {
            List<Form> headerTree = FillRecursive(navigation, 0);
            return headerTree;
        }


        private List<Form> FillRecursive(List<Navigation> flatObjects, int? parentId = null)
        {
            return flatObjects.Where(x => x.ParentFormID.Equals(parentId)).Select(item => new Form
            {
                FormDisplayName = item.FormDisplayName,
                FormID = item.FormID,
                FormController = item.FormController,
                FormAction = item.FormAction,
                Icon = item.Icon,
                Childrens = FillRecursive(flatObjects, item.FormID)
            }).ToList();
        }
    }
}
