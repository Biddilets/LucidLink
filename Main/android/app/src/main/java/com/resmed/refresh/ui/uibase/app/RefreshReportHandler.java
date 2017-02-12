package com.resmed.refresh.ui.uibase.app;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import org.acra.collector.CrashReportData;
import org.acra.sender.ReportSender;
import org.acra.sender.ReportSenderException;
import org.acra.util.JSONReportBuilder.JSONReportException;
import org.json.JSONObject;

public class RefreshReportHandler
  implements ReportSender
{
  private String filePath;
  
  public RefreshReportHandler(File paramFile, String paramString)
  {
    this.filePath = (paramFile.getAbsoluteFile() + "/" + paramString);
  }
  
  public void send(CrashReportData paramCrashReportData)
    throws ReportSenderException
  {
    try
    {
      PrintWriter localPrintWriter = new java/io/PrintWriter;
      localPrintWriter.<init>(this.filePath, "UTF-8");
      localPrintWriter.println(paramCrashReportData.toJSON().toString());
      localPrintWriter.close();
      return;
    }
    catch (FileNotFoundException paramCrashReportData)
    {
      for (;;)
      {
        paramCrashReportData.printStackTrace();
      }
    }
    catch (UnsupportedEncodingException paramCrashReportData)
    {
      for (;;)
      {
        paramCrashReportData.printStackTrace();
      }
    }
    catch (JSONReportBuilder.JSONReportException paramCrashReportData)
    {
      for (;;)
      {
        paramCrashReportData.printStackTrace();
      }
    }
  }
}


/* Location:              C:\Root\@Objects\Tablet\Resmed\App Inspect\JD Gui\com.resmed.refresh-158.jar!\com\resmed\refresh\ui\uibase\app\RefreshReportHandler.class
 * Java compiler version: 6 (50.0)
 * JD-Core Version:       0.7.1
 */