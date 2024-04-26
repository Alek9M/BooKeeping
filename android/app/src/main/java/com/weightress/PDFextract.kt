package com.weightress

import android.Manifest
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContentResolverCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.itextpdf.text.pdf.PdfReader
import com.itextpdf.text.pdf.parser.PdfTextExtractor
import java.io.File


class PDFextract internal constructor(context: ReactApplicationContext?) : ReactContextBaseJavaModule(context) {
    override fun getName(): String {
        return "PDFextract"
    }

    fun checkPermission() {
        val permission: Int = ActivityCompat.checkSelfPermission(this.reactApplicationContext, Manifest.permission.WRITE_EXTERNAL_STORAGE)

        if (permission != PackageManager.PERMISSION_GRANTED) {
            // We don't have permission so prompt the user
                val activity = currentActivity
                if (activity != null) {
                    ActivityCompat.requestPermissions(
                            activity,
                            Array(1) { Manifest.permission.READ_EXTERNAL_STORAGE },
                            1
                    )
                }

        }
    }

    @ReactMethod //(isBlockingSynchronousMethod = true)
    fun extract(location: String, promise: Promise) {
        try {
            checkPermission()
            val noNonsenseLocation = location.replace("%2F", "/").replace("%3A", ":").replace("%20", " ")
            val actualPath = noNonsenseLocation.split(":").last()
            val pdfFile = File(actualPath)
            var parsedText = ""
            val reader = PdfReader(pdfFile.inputStream())
            val n: Int = reader.numberOfPages
            for (i in 0 until n) {
                parsedText = """
            $parsedText\t\n\t${PdfTextExtractor.getTextFromPage(reader, i + 1).trim { it <= ' ' }}
            
            """.trimIndent() //Extracting the content from the different pages
            }
            println(parsedText)
            reader.close()
            promise.resolve(parsedText)
        } catch (e: Exception) {
            println(e)
            promise.reject(e)
        }
    }
}